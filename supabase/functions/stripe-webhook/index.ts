// supabase/functions/stripe-webhook/index.ts
//
// Stripe calls this directly whenever something happens on a
// subscription (payment succeeded, cancelled, etc). This is the
// ONLY place profiles.plan actually gets updated to "plus" — the
// client never sets that itself, since trusting the browser to
// say "I paid" would let anyone fake it.
//
// IMPORTANT: deploy this with --no-verify-jwt (see deployment
// notes) since Stripe's requests carry no Supabase auth token at
// all — Stripe's own signature (verified below) IS the security
// check for this endpoint, not a Supabase JWT.

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20"
});

// Deno's crypto engine needs this specific provider for Stripe's
// signature verification to work — a plain Node-style check
// doesn't run correctly in this runtime.
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  // Signature verification needs the RAW request body — not
  // parsed JSON — so this must be req.text(), read exactly once.
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;

        if (!userId) {
          console.error("checkout.session.completed had no client_reference_id");
          break;
        }

        const { error } = await supabase
          .from("profiles")
          .update({ plan: "plus" })
          .eq("user_id", userId);

        if (error) {
          console.error("Error upgrading plan after checkout:", error);
        } else {
          console.log(`Upgraded user ${userId} to plus`);
        }
        break;
      }

      // Subscription ended, whether by cancellation or repeated
      // payment failure — either way, they're no longer paying,
      // so their access reverts to free.
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { error } = await supabase
          .from("profiles")
          .update({ plan: "free" })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Error downgrading plan after cancellation:", error);
        } else {
          console.log(`Downgraded customer ${customerId} to free`);
        }
        break;
      }

      default:
        // Other event types (invoice.paid, etc) aren't acted on
        // yet — safe to ignore rather than error on.
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("stripe-webhook handler error:", err);
    // Returning 200 here would hide real bugs from Stripe's retry
    // logic, so a genuine processing failure returns 500 instead —
    // Stripe will then retry the event automatically.
    return new Response(JSON.stringify({ error: "Webhook handler failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
// supabase/functions/create-checkout/index.ts
//
// Creates a Stripe Checkout Session for the "Plus" subscription.
// Called from account.html / onboarding-results.html when someone
// clicks "Choose Plus". Returns a URL to redirect the browser to.
//
// Security note: the user is identified from their own auth token
// (verified server-side here), never trusted from anything the
// client claims about itself — the same pattern as delete-account.

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20"
});

// Price IDs live in Supabase secrets (not in this file) so switching
// between Stripe test mode and live mode never needs a code edit:
//   supabase secrets set STRIPE_PRICE_MONTHLY=price_...
//   supabase secrets set STRIPE_PRICE_YEARLY=price_...
// Price IDs aren't sensitive, but keeping them with the keys means
// the key, the prices and the webhook secret always change together.
const PRICE_IDS: Record<string, string | undefined> = {
  month: Deno.env.get("STRIPE_PRICE_MONTHLY"),
  year: Deno.env.get("STRIPE_PRICE_YEARLY")
};


/* ------------------------------------------------------------
   Error reporting to Sentry (optional).
   Does nothing unless the SENTRY_DSN secret is set:
     supabase secrets set SENTRY_DSN=https://...@....ingest.sentry.io/...
   A failure here is swallowed: monitoring must never break the
   function it is watching. Only the error text goes out (emails
   scrubbed), never request bodies or user data.
   ------------------------------------------------------------ */
async function reportToSentry(err: unknown, tags: Record<string, string> = {}) {
  const dsn = Deno.env.get("SENTRY_DSN");
  if (!dsn) return;
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace("/", "");
    const message = (err instanceof Error ? err.message : String(err))
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]");
    const event = {
      event_id: crypto.randomUUID().replaceAll("-", ""),
      timestamp: Date.now() / 1000,
      platform: "javascript",
      level: "error",
      server_name: "supabase-edge-function",
      environment: Deno.env.get("SENTRY_ENV") ?? "production",
      tags,
      exception: { values: [{ type: err instanceof Error ? err.name : "Error", value: message }] }
    };
    await fetch(
      `${url.protocol}//${url.host}/api/${projectId}/store/?sentry_key=${url.username}&sentry_version=7`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(event) }
    );
  } catch (_e) {
    // Never let reporting cause a second failure.
  }
}

// Required for any Edge Function called directly from browser code
// (via supabase.functions.invoke()). Without these, the browser
// either blocks the request before it completes, or blocks reading
// the response even after the function ran successfully — which is
// exactly why no invocation ever showed up in the function's logs.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

Deno.serve(async (req) => {
  // The browser sends a preflight OPTIONS request before the real
  // one, specifically to check whether CORS is allowed. It must
  // get an immediate, empty, 200 response with these headers.
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verify the caller's identity from their own token — this is
    // the only trustworthy source of "who is making this request",
    // never a userId passed in the request body.
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const user = userData.user;

    // Which billing period did they pick? Anything unexpected is
    // rejected rather than guessed at, since this decides what the
    // person is charged.
    let interval = "month";
    try {
      const body = await req.json();
      if (body?.interval) interval = String(body.interval);
    } catch (_err) {
      // No body sent: default to monthly.
    }

    const priceId = PRICE_IDS[interval];
    if (interval !== "month" && interval !== "year") {
      return new Response(JSON.stringify({ error: "Invalid billing interval" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (!priceId) {
      console.error(`Missing price secret for interval "${interval}"`);
      await reportToSentry(new Error(`Missing price secret for interval ${interval}`), { function: "create-checkout" });
      return new Response(JSON.stringify({ error: "Pricing is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Service-role client for reading/writing profiles directly —
    // same reasoning as delete-account: this needs admin-level
    // access that must never live in browser code.
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error loading profile:", profileError);
      return new Response(JSON.stringify({ error: "Could not load profile" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let customerId = profile?.stripe_customer_id;

    // Reuse the existing Stripe customer if we already made one,
    // otherwise create it now and save it back for next time.
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id }
      });
      customerId = customer.id;

      const { error: updateError } = await adminClient
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error saving stripe_customer_id:", updateError);
        // Not fatal to the checkout itself — continue anyway,
        // worst case we create a second customer next time.
      }
    }

    // Always send people back to the real website. The request's own
    // origin can't be trusted here: the apps load from addresses
    // (capacitor://, localhost) that Stripe won't redirect to.
    const siteUrl = Deno.env.get("SITE_URL") || "https://buildyourwayout.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      // Shows an "Add promotion code" box on the Stripe Checkout page.
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/account.html?checkout=success`,
      cancel_url: `${siteUrl}/account.html?checkout=cancelled`,
      // Also stamped directly on the session as a second, redundant
      // way to identify the user in the webhook handler later.
      client_reference_id: user.id
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("create-checkout error:", err);
    await reportToSentry(err, { function: "create-checkout" });
    return new Response(JSON.stringify({ error: "Something went wrong creating checkout" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
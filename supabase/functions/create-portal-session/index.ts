// supabase/functions/create-portal-session/index.ts
//
// Creates a Stripe Customer Portal session — the hosted page where
// someone can cancel their subscription, update their card, or see
// past invoices. This is the correct way to let a Plus subscriber
// downgrade: it actually cancels the real Stripe subscription,
// rather than just flipping a value in our own database while
// Stripe keeps charging them.
//
// When someone cancels here, Stripe fires customer.subscription.deleted,
// which our existing stripe-webhook function already listens for and
// uses to set profiles.plan back to "free" — so no new webhook logic
// is needed, just this one function to get the user *to* the portal.

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20"
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
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

Deno.serve(async (req) => {
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

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (profileError || !profile?.stripe_customer_id) {
      return new Response(
        JSON.stringify({ error: "No subscription found for this account" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Always return to the real website; see create-checkout.
    const siteUrl = Deno.env.get("SITE_URL") || "https://buildyourwayout.app";

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${siteUrl}/account.html`
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("create-portal-session error:", err);
    await reportToSentry(err, { function: "create-portal-session" });
    return new Response(
      JSON.stringify({ error: "Something went wrong opening the billing portal" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
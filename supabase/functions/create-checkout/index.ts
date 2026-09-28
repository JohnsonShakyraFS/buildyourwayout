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

const PLUS_PRICE_ID = "price_1UK1uXCwFWZ22mSi3cN5CYlZ";

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

    const origin = req.headers.get("origin") || "https://buildyourwayout.netlify.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: PLUS_PRICE_ID, quantity: 1 }],
      success_url: `${origin}/account.html?checkout=success`,
      cancel_url: `${origin}/account.html?checkout=cancelled`,
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
    return new Response(JSON.stringify({ error: "Something went wrong creating checkout" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
// supabase/functions/delete-account/index.ts
//
// Deletes the currently authenticated user's account.
//
// Order matters:
//   1. Cancel any Stripe subscription first, so nobody is left billed
//      for an account that no longer exists. If that fails, stop and
//      leave the account untouched so the person can try again.
//   2. Delete the auth user. Reflections, saved builds, progress and
//      the rest all reference auth.users(id) "on delete cascade", so
//      their data goes with it, no separate cleanup needed here.
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected by the Edge
// Functions runtime. STRIPE_SECRET_KEY is the same secret the checkout
// and portal functions already use.

import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@17";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20"
});

// This function is protected by the caller's login token, not by CORS,
// so it answers every origin (the website and both phone apps).
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });

// Subscriptions that can still bill someone.
const BILLING_STATUSES = ["active", "trialing", "past_due", "unpaid"];

async function cancelSubscriptions(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 100
  });

  for (const subscription of subscriptions.data) {
    if (BILLING_STATUSES.includes(subscription.status)) {
      await stripe.subscriptions.cancel(subscription.id);
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Missing Authorization header" }, 401);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify the caller's JWT and get their user id
    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(jwt);

    if (userError || !userData?.user) {
      return json({ error: "Invalid or expired session" }, 401);
    }

    const userId = userData.user.id;

    // 1. Stop any subscription from billing.
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("delete-account: could not load profile:", profileError);
      return json({ error: "We couldn't check your subscription, so your account wasn't deleted." }, 500);
    }

    if (profile?.stripe_customer_id) {
      try {
        await cancelSubscriptions(profile.stripe_customer_id);
      } catch (err) {
        // A customer ID Stripe doesn't know (left over from test mode, say)
        // has nothing to bill, so carry on. Anything else stops the delete.
        const code = (err as { code?: string })?.code;
        if (code !== "resource_missing") {
          console.error("delete-account: could not cancel subscription:", err);
          return json({
            error: "We couldn't cancel your subscription, so your account wasn't deleted. Please contact support."
          }, 500);
        }
      }
    }

    // 2. Delete the account and, through the cascade, all of its data.
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("delete-account: could not delete user:", deleteError);
      return json({ error: "We couldn't delete your account. Please try again or contact support." }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error("delete-account error:", err);
    return json({ error: "Something went wrong deleting your account." }, 500);
  }
});
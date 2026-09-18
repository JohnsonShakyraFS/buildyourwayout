import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

/* ============================================================
   PASTE YOUR SUPABASE CREDENTIALS HERE
   Find these in your Supabase project under Settings → API
   ============================================================ */
const SUPABASE_URL = "https://ajsoxhrcnqnfrvzrwfvt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UuRoxiRQnt_iW-5rRlun0w_UmIn1UHg";

if (SUPABASE_URL.includes("YOUR_SUPABASE") || SUPABASE_ANON_KEY.includes("YOUR_SUPABASE")) {
  console.warn(
    "Build Your Way Out: Supabase credentials are still placeholders. " +
    "Update js/supabaseClient.js with your real Project URL and anon key."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
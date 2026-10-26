import { supabase } from "./supabaseClient.js";

/* ------------------------------------------------------------
   Creates a new account. Supabase sends a confirmation email
   by default — you can turn that off in Supabase under
   Authentication → Providers → Email → "Confirm email" while
   you're testing, and turn it back on before launch.

   captchaToken is optional so this stays backward-compatible —
   only login.js's Turnstile widget actually supplies one.
   ------------------------------------------------------------ */
export async function signUp(email, password, captchaToken) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: captchaToken ? { captchaToken } : undefined
  });
  return { data, error };
}

export async function signIn(email, password, captchaToken) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: captchaToken ? { captchaToken } : undefined
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    // A saved session the server no longer accepts (deleted account,
    // revoked or expired) would otherwise leave different pages
    // disagreeing about whether you're signed in, which sends the
    // browser bouncing between the home page and Mood Builds. Clear it
    // so the visitor is simply logged out. Network failures are left
    // alone, so going offline never signs anyone out.
    if (error.status === 401 || error.status === 403) {
      try {
        await supabase.auth.signOut({ scope: "local" });
      } catch (err) {
        // Nothing more to do; the caller still gets "logged out".
      }
    }
    return null;
  }
  return data?.user || null;
}

/* ------------------------------------------------------------
   Sends a password reset email. The link in that email brings
   the user back to reset-password.html with a temporary
   recovery session already established.
   ------------------------------------------------------------ */
export async function requestPasswordReset(email) {
  // In the phone apps, window.location.origin is an app-only address
  // (capacitor:// or localhost) that an email link can't open, so the
  // link always points at the real website. It must also be listed under
  // Supabase > Authentication > URL Configuration > Redirect URLs.
  const siteUrl = window.Capacitor?.isNativePlatform?.()
    ? "https://buildyourwayout.app"
    : window.location.origin;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password.html`
  });
  return { data, error };
}

/* ------------------------------------------------------------
   Sets a new password. Works both right after clicking a
   reset-password email link (recovery session) and for a
   logged-in user changing their password voluntarily.
   ------------------------------------------------------------ */
export async function updatePassword(newPassword) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  return { data, error };
}

/* ------------------------------------------------------------
   Permanently deletes the current user's account and all of
   their data. This calls a Supabase Edge Function because
   deleting an auth user requires admin privileges that must
   never live in browser code — see supabase/functions/delete-account.
   ------------------------------------------------------------ */
export async function deleteAccount() {
  const { data, error } = await supabase.functions.invoke("delete-account");

  if (error) {
    // The function explains what went wrong in its response body; the
    // default error text only says "non-2xx status code".
    try {
      const body = await error.context?.json?.();
      if (body?.error) error.message = body.error;
    } catch (err) {
      // Keep the default message.
    }
  } else {
    await supabase.auth.signOut();
  }
  return { data, error };
}

/* ------------------------------------------------------------
   Subscribes to auth state changes (login, logout, token
   refresh, password recovery). Callback receives the current
   user or null.
   ------------------------------------------------------------ */
export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((event, session) => {
    // INITIAL_SESSION is only whatever is saved in the browser, which can
    // be stale. Every page already checks the real state itself on load
    // (getCurrentUser), so skip it here.
    if (event === "INITIAL_SESSION") return;

    if (!session) {
      callback(null);
      return;
    }

    // Confirm with the server before telling the page someone is signed in.
    // Deferred so this callback never waits on another Supabase call.
    setTimeout(async () => {
      callback(await getCurrentUser());
    }, 0);
  });
}
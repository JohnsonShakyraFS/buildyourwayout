import { supabase } from "./supabaseClient.js";

/* ------------------------------------------------------------
   Creates a new account. Supabase sends a confirmation email
   by default — you can turn that off in Supabase under
   Authentication → Providers → Email → "Confirm email" while
   you're testing, and turn it back on before launch.
   ------------------------------------------------------------ */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data?.user || null;
}

/* ------------------------------------------------------------
   Sends a password reset email. The link in that email brings
   the user back to reset-password.html with a temporary
   recovery session already established.
   ------------------------------------------------------------ */
export async function requestPasswordReset(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password.html`
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
  if (!error) {
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
  supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
}
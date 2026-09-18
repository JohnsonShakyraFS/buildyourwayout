import { getCurrentUser, onAuthChange, signOut } from "./auth.js";
import { supabase } from "./supabaseClient.js";

/* ------------------------------------------------------------
   Renders login/logout state into any element with
   id="authStatus". Safe to call on pages that don't have
   that element — it just does nothing.
   ------------------------------------------------------------ */
export function initAuthStatus() {
  const el = document.getElementById("authStatus");
  if (!el) return;

  async function render(user) {
    if (user) {
      let label = user.email;

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data?.display_name) {
        label = data.display_name;
      }

      el.innerHTML = `
        <span class="auth-email">${label}</span>
        <button type="button" class="auth-link-btn" id="logoutBtn">Log Out</button>
      `;
      const logoutBtn = document.getElementById("logoutBtn");
      logoutBtn.addEventListener("click", async () => {
        await signOut();
        window.location.href = "index.html";
      });
    } else {
      el.innerHTML = "";
    }
  }

  getCurrentUser().then(render);
  onAuthChange(render);
}
import { getCurrentUser, onAuthChange, signOut } from "./auth.js";

/* ------------------------------------------------------------
   Renders login/logout state into any element with
   id="authStatus". Safe to call on pages that don't have
   that element — it just does nothing.
   ------------------------------------------------------------ */
export function initAuthStatus() {
  const el = document.getElementById("authStatus");
  if (!el) return;

  function render(user) {
    if (user) {
      el.innerHTML = `
        <span class="auth-email">${user.email}</span>
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
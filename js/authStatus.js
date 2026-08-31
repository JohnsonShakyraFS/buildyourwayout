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
        <a href="account.html" class="auth-link">Account</a>
        <span class="auth-email">${user.email}</span>
        <button type="button" class="auth-link-btn" id="logoutBtn">Log Out</button>
      `;
      const logoutBtn = document.getElementById("logoutBtn");
      logoutBtn.addEventListener("click", async () => {
        await signOut();
      });
    } else {
      el.innerHTML = `<a href="login.html" class="auth-link">Log In</a>`;
    }
  }

  getCurrentUser().then(render);
  onAuthChange(render);
}
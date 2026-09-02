import { getCurrentUser, onAuthChange } from "./auth.js";

function renderLinks(user) {
  const el = document.getElementById("navLinks");
  if (!el) return;

  if (user) {
    el.innerHTML = `
      <a href="index.html">Home</a>
      <a href="mood.html">Mood Builds</a>
      <a href="journal.html">Journal</a>
      <a href="account.html">Account</a>
    `;
  } else {
    el.innerHTML = `
      <a href="index.html">Home</a>
      <a href="index.html#how-it-works">How It Works</a>
      <a href="pricing.html">Pricing</a>
      <a href="login.html" class="nav-button">Log In / Sign Up</a>
    `;
  }
}

export function initMainNav() {
  getCurrentUser().then(renderLinks);
  onAuthChange(renderLinks);
}
import { getCurrentUser, onAuthChange } from "./auth.js";

function renderLinks(user) {
  const el = document.getElementById("navLinks");
  if (!el) return;

  if (user) {
    // Inside the native app, "Home" points to the marketing
    // homepage — not useful once someone's already signed in and
    // using the app. The website keeps it, since there it's a
    // normal, reachable page in the same navigation.
    const isNativeApp = window.Capacitor?.isNativePlatform?.();

    el.innerHTML = `
      ${isNativeApp ? "" : '<a href="index.html">Home</a>'}
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

function renderSkeleton() {
  const el = document.getElementById("navLinks");
  if (!el) return;
  el.innerHTML = `
    <span class="nav-links-skeleton">
      <span></span><span></span><span></span>
    </span>
  `;
}

export function initMainNav() {
  renderSkeleton();
  getCurrentUser().then(renderLinks);
  onAuthChange(renderLinks);
}
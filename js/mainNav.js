import { getCurrentUser, onAuthChange } from "./auth.js";
import { validateThemeForPlan } from "./theme.js";
import { applySiteGate, isNativeApp } from "./siteGate.js";
import { syncStatusBar } from "./nativeShell.js";

function renderLinks(user) {
  const el = document.getElementById("navLinks");
  if (!el) return;

  if (user) {
    // Signed-in people go straight to the product, so the marketing
    // homepage is hidden from their navigation (on the website and
    // in the app alike).
    el.innerHTML = `
      <a href="mood.html">Mood Builds</a>
      <a href="my-builds.html">My Builds</a>
      <a href="journal.html">Journal</a>
      <a href="account.html">Account</a>
    `;
  } else {
    el.innerHTML = `
      <a href="index.html">Home</a>
      <a href="index.html#how-it-works">How It Works</a>
      ${isNativeApp() ? "" : '<a href="pricing.html">Pricing</a>'}
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
  syncStatusBar();
  renderSkeleton();
  getCurrentUser().then((user) => {
    applySiteGate(user);
    renderLinks(user);
    // Only does network work if a non-default theme is stored
    if (user) validateThemeForPlan(user.id);
  });
  onAuthChange((user) => {
    renderLinks(user);
    applySiteGate(user);
  });
}
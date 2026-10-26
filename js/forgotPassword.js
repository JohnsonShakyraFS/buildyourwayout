import "./monitoring.js";
import { requestPasswordReset } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

/* ============================================================
   FORGOT PASSWORD
   Supabase's CAPTCHA protection covers password resets as well
   as sign up and log in, so this page shows the same hCaptcha
   check and sends its token along with the request.
   ============================================================ */

const form = document.getElementById("forgotForm");
const emailInput = document.getElementById("forgotEmail");
const errorEl = document.getElementById("forgotError");
const noticeEl = document.getElementById("forgotNotice");
const submitBtn = document.getElementById("forgotSubmitBtn");

let captchaToken = null;
let captchaFailed = false;

// The hCaptcha widget calls these by name.
window.onCaptchaSuccess = function (token) {
  captchaToken = token;
  captchaFailed = false;
};

window.onCaptchaExpired = function () {
  captchaToken = null;
};

// If the widget itself can't load (a third-party outage), don't block our
// own form. Supabase still enforces the check on its side.
window.onCaptchaError = function () {
  console.warn("hCaptcha failed to load.");
  captchaFailed = true;
};

function resetCaptcha() {
  captchaToken = null;
  if (window.hcaptcha) window.hcaptcha.reset();
}

function friendlyError(error) {
  const message = error?.message || "";
  if (error?.status === 429 || /rate limit|too many/i.test(message)) {
    return "Too many requests. Please wait a minute and try again.";
  }
  if (/captcha/i.test(message)) {
    return "The verification check didn't go through. Please complete it again and retry.";
  }
  if (/fetch|network|failed to/i.test(message)) {
    return "Couldn't reach the server. Check your internet connection and try again.";
  }
  return message || "Something went wrong. Please try again.";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorEl.hidden = true;
  noticeEl.hidden = true;

  if (!captchaToken && !captchaFailed) {
    errorEl.textContent = "Please complete the verification check before continuing.";
    errorEl.hidden = false;
    return;
  }

  const email = emailInput.value.trim();
  if (!email) return;

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  const { error } = await requestPasswordReset(email, captchaToken);

  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;

  // CAPTCHA tokens are single-use: get a fresh one for any retry.
  resetCaptcha();

  if (error) {
    errorEl.textContent = friendlyError(error);
    errorEl.hidden = false;
    return;
  }

  // Same message whether or not the address has an account.
  noticeEl.textContent =
    "If an account exists for that email, a reset link is on its way. Check your spam folder too.";
  noticeEl.hidden = false;
});
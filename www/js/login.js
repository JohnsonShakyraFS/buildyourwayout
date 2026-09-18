import { signUp, signIn, getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { redirectAfterAuth } from "./onboarding.js";

initAuthStatus();
registerServiceWorker();

const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("authEmail");
const passwordInput = document.getElementById("authPassword");
const errorEl = document.getElementById("authError");
const noticeEl = document.getElementById("authNotice");
const submitBtn = document.getElementById("authSubmitBtn");
const heading = document.getElementById("authHeading");
const subheading = document.getElementById("authSubheading");
const toggleText = document.getElementById("authToggleText");
const toggleBtn = document.getElementById("authToggleBtn");
const forgotRow = document.getElementById("authForgotRow");

let mode = "signin"; // or "signup"

/* If already logged in, no need to be here */
getCurrentUser().then(user => {
  if (user) redirectAfterAuth(user);
});

function validateEmailLive() {
  const value = emailInput.value.trim();

  if (value === "") {
    emailHint.textContent = "";
    emailHint.className = "field-hint";
    emailInput.classList.remove("field-invalid", "field-valid");
    return;
  }

  const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  emailHint.textContent = looksValid ? "" : "That doesn't look like a valid email.";
  emailHint.className = "field-hint" + (looksValid ? "" : " invalid");
  emailInput.classList.toggle("field-invalid", !looksValid);
  emailInput.classList.toggle("field-valid", looksValid);
}

function validatePasswordLive() {
  if (mode !== "signup" || passwordInput.value === "") {
    passwordHint.textContent = "";
    passwordHint.className = "field-hint";
    passwordInput.classList.remove("field-invalid", "field-valid");
    return;
  }

  const remaining = 6 - passwordInput.value.length;
  const longEnough = remaining <= 0;

  passwordHint.textContent = longEnough
    ? "Good length."
    : `${remaining} more character${remaining === 1 ? "" : "s"} needed.`;
  passwordHint.className = "field-hint" + (longEnough ? " valid" : " invalid");
  passwordInput.classList.toggle("field-invalid", !longEnough);
  passwordInput.classList.toggle("field-valid", longEnough);
}

emailInput.addEventListener("input", validateEmailLive);
passwordInput.addEventListener("input", validatePasswordLive);

function setMode(newMode) {
  mode = newMode;
  errorEl.hidden = true;
  noticeEl.hidden = true;

  if (mode === "signin") {
    heading.textContent = "Welcome back.";
    subheading.textContent = "Log in to see your journal across devices.";
    submitBtn.textContent = "♡ Log In";
    toggleText.textContent = "Don't have an account?";
    toggleBtn.textContent = "Sign Up";
    forgotRow.hidden = false;
    passwordInput.setAttribute("autocomplete", "current-password");
  } else {
    heading.textContent = "Let's get you set up.";
    subheading.textContent = "Create an account to save your journal.";
    submitBtn.textContent = "♡ Sign Up";
    toggleText.textContent = "Already have an account?";
    toggleBtn.textContent = "Log In";
    forgotRow.hidden = true;
    passwordInput.setAttribute("autocomplete", "new-password");
  }

  validatePasswordLive();
}

toggleBtn.addEventListener("click", () => {
  setMode(mode === "signin" ? "signup" : "signin");
});

/* ------------------------------------------------------------
   Turns raw error strings (which can be technical, like
   "Failed to fetch" from a dropped connection) into plain
   language. Supabase's own messages (e.g. "Invalid login
   credentials") are already clear and pass through unchanged.
   ------------------------------------------------------------ */
function friendlyAuthError(message) {
  if (!message) return "Something went wrong. Please try again.";
  const lower = message.toLowerCase();
  if (lower.includes("failed to fetch") || lower.includes("network")) {
    return "Couldn't reach the server. Check your internet connection and try again.";
  }
  return message;
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorEl.hidden = true;
  noticeEl.hidden = true;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = mode === "signin" ? "Logging in..." : "Signing up...";

  const { data, error } =
    mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password);

  submitBtn.disabled = false;
  submitBtn.textContent = originalLabel;

  if (error) {
    errorEl.textContent = friendlyAuthError(error.message);
    errorEl.hidden = false;
    return;
  }

  if (mode === "signup" && !data.session) {
    // Email confirmation is on — no session yet
    noticeEl.textContent = "Check your email to confirm your account, then log in.";
    noticeEl.hidden = false;
    setMode("signin");
    return;
  }

  await redirectAfterAuth(data.user);
});

setMode("signin");
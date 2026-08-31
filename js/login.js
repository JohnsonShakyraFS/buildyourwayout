import { signUp, signIn, getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

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
  if (user) window.location.href = "mood.html";
});

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
  } else {
    heading.textContent = "Let's get you set up.";
    subheading.textContent = "Create an account to save your journal.";
    submitBtn.textContent = "♡ Sign Up";
    toggleText.textContent = "Already have an account?";
    toggleBtn.textContent = "Log In";
    forgotRow.hidden = true;
  }
}

toggleBtn.addEventListener("click", () => {
  setMode(mode === "signin" ? "signup" : "signin");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorEl.hidden = true;
  noticeEl.hidden = true;

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  submitBtn.disabled = true;

  const { data, error } =
    mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password);

  submitBtn.disabled = false;

  if (error) {
    errorEl.textContent = error.message;
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

  window.location.href = "mood.html";
});

setMode("signin");
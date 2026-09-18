import { updatePassword } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

const form = document.getElementById("resetForm");
const passwordInput = document.getElementById("resetPassword");
const confirmInput = document.getElementById("resetPasswordConfirm");
const errorEl = document.getElementById("resetError");
const noticeEl = document.getElementById("resetNotice");
const submitBtn = document.getElementById("resetSubmitBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorEl.hidden = true;
  noticeEl.hidden = true;

  if (passwordInput.value !== confirmInput.value) {
    errorEl.textContent = "Passwords don't match.";
    errorEl.hidden = false;
    return;
  }

  submitBtn.disabled = true;
  const { error } = await updatePassword(passwordInput.value);
  submitBtn.disabled = false;

  if (error) {
    errorEl.textContent =
      error.message + " Your reset link may have expired — request a new one from the login page.";
    errorEl.hidden = false;
    return;
  }

  noticeEl.textContent = "Password updated. Redirecting you to your builds...";
  noticeEl.hidden = false;
  form.reset();
  setTimeout(() => {
    window.location.href = "mood.html";
  }, 1500);
});
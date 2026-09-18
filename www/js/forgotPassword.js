import { requestPasswordReset } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

const form = document.getElementById("forgotForm");
const emailInput = document.getElementById("forgotEmail");
const errorEl = document.getElementById("forgotError");
const noticeEl = document.getElementById("forgotNotice");
const submitBtn = document.getElementById("forgotSubmitBtn");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorEl.hidden = true;
  noticeEl.hidden = true;
  submitBtn.disabled = true;

  const { error } = await requestPasswordReset(emailInput.value.trim());

  submitBtn.disabled = false;

  if (error) {
    errorEl.textContent = error.message;
    errorEl.hidden = false;
    return;
  }

  noticeEl.textContent = "If that email has an account, a reset link is on its way. Check your inbox.";
  noticeEl.hidden = false;
  form.reset();
});
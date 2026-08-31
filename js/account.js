import { getCurrentUser, updatePassword, deleteAccount } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

const emailLine = document.getElementById("accountEmailLine");

const passwordForm = document.getElementById("passwordForm");
const newPasswordInput = document.getElementById("newPassword");
const newPasswordConfirmInput = document.getElementById("newPasswordConfirm");
const passwordError = document.getElementById("passwordError");
const passwordNotice = document.getElementById("passwordNotice");
const passwordSubmitBtn = document.getElementById("passwordSubmitBtn");

const showDeleteBtn = document.getElementById("showDeleteBtn");
const deleteConfirmBlock = document.getElementById("deleteConfirmBlock");
const deleteConfirmInput = document.getElementById("deleteConfirmInput");
const deleteError = document.getElementById("deleteError");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

/* Guests shouldn't be here */
getCurrentUser().then(user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  emailLine.textContent = `Signed in as ${user.email}`;
});

/* ---------- Change password ---------- */
passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  passwordError.hidden = true;
  passwordNotice.hidden = true;

  if (newPasswordInput.value !== newPasswordConfirmInput.value) {
    passwordError.textContent = "Passwords don't match.";
    passwordError.hidden = false;
    return;
  }

  passwordSubmitBtn.disabled = true;
  const { error } = await updatePassword(newPasswordInput.value);
  passwordSubmitBtn.disabled = false;

  if (error) {
    passwordError.textContent = error.message;
    passwordError.hidden = false;
    return;
  }

  passwordNotice.textContent = "Password updated.";
  passwordNotice.hidden = false;
  passwordForm.reset();
});

/* ---------- Delete account ---------- */
showDeleteBtn.addEventListener("click", () => {
  deleteConfirmBlock.hidden = false;
  showDeleteBtn.hidden = true;
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteConfirmBlock.hidden = true;
  showDeleteBtn.hidden = false;
  deleteConfirmInput.value = "";
  deleteError.hidden = true;
});

confirmDeleteBtn.addEventListener("click", async () => {
  deleteError.hidden = true;

  if (deleteConfirmInput.value.trim() !== "DELETE") {
    deleteError.textContent = 'Please type "DELETE" exactly to confirm.';
    deleteError.hidden = false;
    return;
  }

  confirmDeleteBtn.disabled = true;
  const { error } = await deleteAccount();
  confirmDeleteBtn.disabled = false;

  if (error) {
    deleteError.textContent =
      "Something went wrong deleting your account: " + error.message + ". Please try again or contact support.";
    deleteError.hidden = false;
    return;
  }

  window.location.href = "index.html";
});
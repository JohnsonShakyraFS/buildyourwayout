import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

const startBtn = document.getElementById("startOnboardingBtn");

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

requireUser();

startBtn.addEventListener("click", () => {
  window.location.href = "onboarding-questionnaire.html";
});
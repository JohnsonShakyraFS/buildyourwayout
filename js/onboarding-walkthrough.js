import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
  }
}

requireUser();

const steps = [
  document.getElementById("walkStep1"),
  document.getElementById("walkStep2"),
  document.getElementById("walkStep3")
];

let currentStepIndex = 0;

function goToNextStep() {
  steps[currentStepIndex].classList.add("hidden");
  currentStepIndex++;
  steps[currentStepIndex].classList.remove("hidden");
  steps[currentStepIndex].scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelectorAll(".walkthrough-next-btn").forEach((btn) => {
  btn.addEventListener("click", goToNextStep);
});

document.getElementById("finishWalkthroughBtn").addEventListener("click", () => {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") || "mood.html";
  window.location.href = next;
});
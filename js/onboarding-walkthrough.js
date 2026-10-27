import "./monitoring.js";
import { redirectLoggedOut } from "./siteGate.js";
import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirectLoggedOut();
  }
}

requireUser();

const steps = [
  document.getElementById("walkStep1"),
  document.getElementById("walkStep2"),
  document.getElementById("walkStep3")
];

let currentStepIndex = 0;

/* Keeps the page at the very top. Done a few times because the phone
   can move the page again just after the layout changes. */
function scrollToTop() {
  const top = () => {
    window.scrollTo(0, 0);
    if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  top();
  requestAnimationFrame(top);
  setTimeout(top, 60);
  setTimeout(top, 250);
}

function goToNextStep() {
  steps[currentStepIndex].classList.add("hidden");
  currentStepIndex++;
  steps[currentStepIndex].classList.remove("hidden");
  scrollToTop();
}

document.querySelectorAll(".walkthrough-next-btn").forEach((btn) => {
  btn.addEventListener("click", goToNextStep);
});

document.getElementById("finishWalkthroughBtn").addEventListener("click", () => {
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next") || "mood.html";
  window.location.href = next;
});
import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) window.location.href = "login.html";
  return user;
}

requireUser();

const form = document.getElementById("onboardingForm");
const errorEl = document.getElementById("onboardingError");

const answers = {
  motivation: null,
  buildInterest: null,
  codingComfort: null,
  goals: []
};

document.querySelectorAll(".onboarding-question").forEach(section => {
  const key = section.dataset.question;
  const selectType = section.dataset.select;

  section.addEventListener("click", (event) => {
    const card = event.target.closest(".choice-card");
    if (!card) return;

    const value = card.dataset.value;

    if (selectType === "single") {
      section.querySelectorAll(".choice-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      answers[key] = value;
    } else {
      card.classList.toggle("selected");
      const idx = answers[key].indexOf(value);
      if (idx === -1) {
        answers[key].push(value);
      } else {
        answers[key].splice(idx, 1);
      }
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!answers.motivation || !answers.buildInterest || !answers.codingComfort) {
    errorEl.textContent = "Please make a selection for each question.";
    errorEl.hidden = false;
    errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  localStorage.setItem("onboardingAnswers", JSON.stringify(answers));
  window.location.href = "onboarding-results.html";
});
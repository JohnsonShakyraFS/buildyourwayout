import { getCurrentUser } from "./auth.js";
import { supabase } from "./supabaseClient.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { startFunFactRotation } from "./funFacts.js";

initAuthStatus();
registerServiceWorker();
startFunFactRotation("funFactText");

const welcomeHeading = document.getElementById("welcomeHeading");
const welcomeSubheading = document.getElementById("welcomeSubheading");

const nameForm = document.getElementById("nameForm");
const nameInput = document.getElementById("nameInput");
const nameError = document.getElementById("nameError");

const ageForm = document.getElementById("ageForm");
const ageInput = document.getElementById("ageInput");
const ageError = document.getElementById("ageError");
const ageSubmitBtn = document.getElementById("ageSubmitBtn");

const transitionStep = document.getElementById("transitionStep");
const transitionMessage = document.getElementById("transitionMessage");
const transitionContinueBtn = document.getElementById("transitionContinueBtn");

let currentUser = null;
let enteredName = "";

async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

requireUser().then((user) => {
  currentUser = user;
});

/* ------------------------------------------------------------
   STEP 1 -> STEP 2
   Capture the name, then reveal a personalized age question
   instead of navigating to a new page — keeps this feeling like
   one continuous conversation rather than a form reload.
   ------------------------------------------------------------ */
nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  nameError.hidden = true;

  const name = nameInput.value.trim();
  if (!name) {
    nameError.textContent = "Please enter your name.";
    nameError.hidden = false;
    return;
  }

  enteredName = name;

  nameForm.classList.add("hidden");
  welcomeHeading.textContent = `Nice to meet you, ${name}.`;
  welcomeSubheading.textContent = "How old are you?";
  ageForm.classList.remove("hidden");
  ageInput.focus();
});

/* ------------------------------------------------------------
   STEP 2 -> STEP 3
   Save name + age to profiles, then reveal the transition
   message before heading into the actual questionnaire.
   ------------------------------------------------------------ */
ageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  ageError.hidden = true;

  const age = Number(ageInput.value);
  if (!age || age < 13 || age > 120) {
    ageError.textContent = "Please enter a valid age (13 or older).";
    ageError.hidden = false;
    return;
  }

  if (!currentUser) {
    ageError.textContent = "We couldn't confirm your session. Please refresh and try again.";
    ageError.hidden = false;
    return;
  }

  ageSubmitBtn.disabled = true;
  ageSubmitBtn.textContent = "Saving...";

  const { error } = await supabase
    .from("profiles")
    .upsert({
      user_id: currentUser.id,
      display_name: enteredName,
      age: age,
      updated_at: new Date().toISOString()
    });

  ageSubmitBtn.disabled = false;
  ageSubmitBtn.textContent = "Continue";

  if (error) {
    console.error("Error saving intro details:", error);
    ageError.textContent = "We couldn't save that. Check your connection and try again.";
    ageError.hidden = false;
    return;
  }

  ageForm.classList.add("hidden");
  welcomeHeading.textContent = "Perfect!";
  welcomeSubheading.textContent = "";
  transitionMessage.textContent =
    "Let's get to know you and craft the best experience tailored to your needs and goals!";
  transitionStep.classList.remove("hidden");

  /* Auto-advances after a couple seconds so it feels like a
     natural pause rather than a dead end, but a tap continues
     immediately for anyone who doesn't want to wait. */
  const goToQuestionnaire = () => {
    window.location.href = "onboarding-questionnaire.html";
  };
  const autoAdvanceTimer = setTimeout(goToQuestionnaire, 2200);
  transitionContinueBtn.addEventListener("click", () => {
    clearTimeout(autoAdvanceTimer);
    goToQuestionnaire();
  });
});
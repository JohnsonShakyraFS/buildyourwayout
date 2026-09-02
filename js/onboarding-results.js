import { supabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { computeProfile } from "./onboarding.js";

initAuthStatus();
registerServiceWorker();

const profileNameEl = document.getElementById("profileName");
const profileBlurbEl = document.getElementById("profileBlurb");
const profileTagsEl = document.getElementById("profileTags");
const startBtn = document.getElementById("startBuildingBtn");
const saveErrorEl = document.getElementById("onboardingSaveError");

let currentUser = null;
let answers = null;
let profile = null;

async function init() {
  currentUser = await getCurrentUser();
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const stored = localStorage.getItem("onboardingAnswers");
  if (!stored) {
    window.location.href = "onboarding-questionnaire.html";
    return;
  }

  answers = JSON.parse(stored);
  profile = computeProfile(answers);

  profileNameEl.textContent = profile.profileName;
  profileBlurbEl.textContent = profile.blurb;

  profileTagsEl.innerHTML = profile.tags
    .map(tag => `<li>${tag}</li>`)
    .join("");
}

startBtn.addEventListener("click", async () => {
  startBtn.disabled = true;
  startBtn.textContent = "Saving your profile...";

  const { error } = await supabase
    .from("profiles")
    .upsert({
      user_id: currentUser.id,
      motivation: answers.motivation,
      build_interest: answers.buildInterest,
      coding_comfort: answers.codingComfort,
      goals: answers.goals,
      profile_type: profile.profileName,
      onboarding_completed: true,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error("Error saving profile:", error);
    saveErrorEl.textContent =
      "We couldn't save your profile, but you can still continue — you can retake this later from your account.";
    saveErrorEl.hidden = false;
  }

  localStorage.removeItem("onboardingAnswers");
  window.location.href = "mood.html";
});

init();
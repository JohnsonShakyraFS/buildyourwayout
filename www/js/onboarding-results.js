import { supabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { computeProfile } from "./onboarding.js";

initAuthStatus();
registerServiceWorker();

const resultsCard = document.getElementById("resultsCard");
const profileNameEl = document.getElementById("profileName");
const profileBlurbEl = document.getElementById("profileBlurb");
const profileTagsEl = document.getElementById("profileTags");
const startBtn = document.getElementById("startBuildingBtn");
const saveErrorEl = document.getElementById("onboardingSaveError");

const upgradeBanner = document.getElementById("upgradeBanner");
const upgradeBannerClose = document.getElementById("upgradeBannerClose");

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

/* ------------------------------------------------------------
   Saves the profile as before, then reveals the upgrade banner
   instead of redirecting straight to mood.html — the banner's
   own buttons decide where to go next.
   ------------------------------------------------------------ */
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

  startBtn.disabled = false;
  startBtn.textContent = "Ready to build your way out? →";

  resultsCard.classList.add("hidden");
  upgradeBanner.classList.remove("hidden");
  upgradeBanner.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* Closing the banner (the X) means "not right now" — go straight
   to builds on the free plan, same as picking "Continue Free". */
upgradeBannerClose.addEventListener("click", () => {
  window.location.href = "mood.html";
});

document.querySelectorAll(".upgrade-plan-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const plan = btn.dataset.plan;

    if (plan === "free") {
      window.location.href = "mood.html";
      return;
    }

    // Plus/Premium: billing isn't connected yet, so this heads to
    // the Subscription section already sitting on the Account page
    // — once Stripe is wired up in Phase 9, only this destination
    // needs to change, nothing else in this flow does.
    window.location.href = "account.html";
  });
});

init();
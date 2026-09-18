import { getCurrentUser } from "./auth.js";
import { supabase } from "./supabaseClient.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { startFunFactRotation } from "./funFacts.js";

initAuthStatus();
registerServiceWorker();
startFunFactRotation("funFactText");

const introForm = document.getElementById("introForm");
const nameInput = document.getElementById("nameInput");
const ageInput = document.getElementById("ageInput");
const introError = document.getElementById("introError");
const startBtn = document.getElementById("startOnboardingBtn");

let currentUser = null;

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

introForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  introError.hidden = true;

  const name = nameInput.value.trim();
  const age = Number(ageInput.value);

  if (!name) {
    introError.textContent = "Please enter your name.";
    introError.hidden = false;
    return;
  }

  if (!age || age < 13 || age > 120) {
    introError.textContent = "Please enter a valid age (13 or older).";
    introError.hidden = false;
    return;
  }

  if (!currentUser) {
    introError.textContent = "We couldn't confirm your session. Please refresh and try again.";
    introError.hidden = false;
    return;
  }

  startBtn.disabled = true;
  startBtn.textContent = "Saving...";

  const { error } = await supabase
    .from("profiles")
    .upsert({
      user_id: currentUser.id,
      display_name: name,
      age: age,
      updated_at: new Date().toISOString()
    });

  startBtn.disabled = false;
  startBtn.textContent = "Continue";

  if (error) {
    console.error("Error saving intro details:", error);
    introError.textContent = "We couldn't save that. Check your connection and try again.";
    introError.hidden = false;
    return;
  }

  window.location.href = "onboarding-questionnaire.html";
});
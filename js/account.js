import { getCurrentUser, updatePassword, deleteAccount } from "./auth.js";
import { supabase } from "./supabaseClient.js";
import { initAuthStatus } from "./authStatus.js";
import { initMainNav } from "./mainNav.js";
// ...
initAuthStatus();
initMainNav();
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

const nameForm = document.getElementById("nameForm");
const displayNameInput = document.getElementById("displayNameInput");
const nameNotice = document.getElementById("nameNotice");

const prefEmailReminders = document.getElementById("prefEmailReminders");
const prefShowMoodNotes = document.getElementById("prefShowMoodNotes");
const prefsSaveBtn = document.getElementById("prefsSaveBtn");
const prefsNotice = document.getElementById("prefsNotice");

const planGrid = document.getElementById("planGrid");

let currentUserId = null;

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

const profileTypeLine = document.getElementById("profileTypeLine");
const retakeQuestionnaireBtn = document.getElementById("retakeQuestionnaireBtn");
const progressStats = document.getElementById("progressStats");
const buildHistoryList = document.getElementById("buildHistoryList");

const MOOD_LABELS = {
  1: "😞", 2: "😕", 3: "😐", 4: "🙂", 5: "😊"
};

/* ============================================================
   INITIAL LOAD
   ============================================================ */

getCurrentUser().then(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUserId = user.id;
  emailLine.textContent = `Signed in as ${user.email}`;

  await loadProfile(user.id);
  await loadAccountDetails(user.id);
  await loadProgressAndHistory(user.id);
});

/* ============================================================
   BUILD PROFILE
   ============================================================ */

async function loadProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("profile_type")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error loading profile:", error);
    profileTypeLine.textContent = "We couldn't load your Build Profile right now.";
    return;
  }

  profileTypeLine.textContent = data?.profile_type
    ? `You're a ${data.profile_type}.`
    : "Complete the questionnaire to get your Build Profile.";
}

retakeQuestionnaireBtn.addEventListener("click", () => {
  window.location.href = "onboarding-questionnaire.html";
});

/* ============================================================
   NAME, PREFERENCES, PLAN
   ============================================================ */

async function loadAccountDetails(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, plan, preferences")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error loading account details:", error);
    return;
  }

  displayNameInput.value = data?.display_name || "";

  const prefs = data?.preferences || {};
  prefEmailReminders.checked = Boolean(prefs.email_reminders);
  prefShowMoodNotes.checked = prefs.show_mood_notes !== false; // default on

  highlightSelectedPlan(data?.plan || "free");
}

nameForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  nameNotice.hidden = true;

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayNameInput.value.trim() || null })
    .eq("user_id", currentUserId);

  if (error) {
    console.error("Error saving name:", error);
    return;
  }

  nameNotice.textContent = "Name saved.";
  nameNotice.hidden = false;
});

prefsSaveBtn.addEventListener("click", async () => {
  prefsNotice.hidden = true;

  const preferences = {
    email_reminders: prefEmailReminders.checked,
    show_mood_notes: prefShowMoodNotes.checked
  };

  const { error } = await supabase
    .from("profiles")
    .update({ preferences })
    .eq("user_id", currentUserId);

  if (error) {
    console.error("Error saving preferences:", error);
    return;
  }

  prefsNotice.textContent = "Preferences saved.";
  prefsNotice.hidden = false;
});

function highlightSelectedPlan(plan) {
  planGrid.querySelectorAll(".plan-card").forEach(card => {
    card.classList.toggle("current-plan", card.dataset.plan === plan);
    const btn = card.querySelector(".plan-select-btn");
    btn.textContent = card.dataset.plan === plan ? "Current Plan" : "Select";
    btn.disabled = card.dataset.plan === plan;
  });
}

planGrid.addEventListener("click", async (event) => {
  const btn = event.target.closest(".plan-select-btn");
  if (!btn || btn.disabled) return;

  const card = btn.closest(".plan-card");
  const plan = card.dataset.plan;

  btn.disabled = true;
  btn.textContent = "Saving...";

  const { error } = await supabase
    .from("profiles")
    .update({ plan })
    .eq("user_id", currentUserId);

  if (error) {
    console.error("Error updating plan:", error);
    btn.disabled = false;
    btn.textContent = "Select";
    return;
  }

  highlightSelectedPlan(plan);
});

/* ============================================================
   PROGRESS + BUILD HISTORY
   Both derived from the reflections table — each saved
   reflection represents one completed build.
   ============================================================ */

   async function loadProgressAndHistory(userId) {
    progressStats.innerHTML = `<div class="loading-inline"><span class="spinner"></span> Loading your progress...</div>`;
    buildHistoryList.innerHTML = `<div class="loading-inline"><span class="spinner"></span> Loading your build history...</div>`;
  
    const { data, error } = await supabase
      .from("reflections")
      .select("id, project, mood_label, mood_before, mood_after, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  
    // ...rest of the function stays exactly the same

  if (error) {
    console.error("Error loading build history:", error);
    progressStats.innerHTML = `<p class="journal-error">Couldn't load your progress.</p>`;
    buildHistoryList.innerHTML = `<p class="journal-error">Couldn't load your build history.</p>`;
    return;
  }

  renderProgress(data || []);
  renderBuildHistory(data || []);
}

function renderProgress(reflections) {
  const totalBuilds = reflections.length;
  const { currentStreak, longestStreak } = computeStreaks(reflections);

  progressStats.innerHTML = `
    <div class="progress-stat">
      <span class="progress-stat-number">${totalBuilds}</span>
      <span class="progress-stat-label">Build${totalBuilds === 1 ? "" : "s"} completed</span>
    </div>
    <div class="progress-stat">
      <span class="progress-stat-number">${currentStreak}</span>
      <span class="progress-stat-label">Day streak</span>
    </div>
    <div class="progress-stat">
      <span class="progress-stat-number">${longestStreak}</span>
      <span class="progress-stat-label">Longest streak</span>
    </div>
  `;
}

/* ------------------------------------------------------------
   Streaks are counted in whole calendar days (user's local
   timezone), deduping multiple builds on the same day. Current
   streak only counts if it includes today or yesterday —
   otherwise it's considered broken.
   ------------------------------------------------------------ */
function computeStreaks(reflections) {
  if (reflections.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dayStrings = [...new Set(
    reflections.map(r => new Date(r.created_at).toDateString())
  )]
    .map(str => new Date(str))
    .sort((a, b) => a - b);

  let longestStreak = 1;
  let runLength = 1;

  for (let i = 1; i < dayStrings.length; i++) {
    const diffDays = Math.round((dayStrings[i] - dayStrings[i - 1]) / 86400000);
    if (diffDays === 1) {
      runLength++;
    } else {
      runLength = 1;
    }
    longestStreak = Math.max(longestStreak, runLength);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const mostRecentDay = dayStrings[dayStrings.length - 1];
  const daysSinceLast = Math.round((today - mostRecentDay) / 86400000);

  let currentStreak = 0;
  if (daysSinceLast <= 1) {
    currentStreak = 1;
    for (let i = dayStrings.length - 1; i > 0; i--) {
      const diffDays = Math.round((dayStrings[i] - dayStrings[i - 1]) / 86400000);
      if (diffDays === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return { currentStreak, longestStreak };
}

function renderBuildHistory(reflections) {
  if (reflections.length === 0) {
    buildHistoryList.innerHTML = `
      <div class="empty-journal">
        <h3>No builds yet.</h3>
        <p>Once you complete a reflection, it'll show up here.</p>
      </div>
    `;
    return;
  }

  buildHistoryList.innerHTML = reflections.map(r => {
    const date = new Date(r.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    const beforeIcon = MOOD_LABELS[r.mood_before] || "";
    const afterIcon = MOOD_LABELS[r.mood_after] || "";
    const shift = beforeIcon && afterIcon
      ? `<span class="build-history-shift">${beforeIcon} → ${afterIcon}</span>`
      : "";

    return `
      <div class="build-history-row">
        <div>
          <strong>${escapeHtml(r.project || "Build Reflection")}</strong>
          <span class="build-history-date">${date}</span>
        </div>
        ${shift}
      </div>
    `;
  }).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ============================================================
   CHANGE PASSWORD (unchanged from before)
   ============================================================ */

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

/* ============================================================
   DELETE ACCOUNT (unchanged from before)
   ============================================================ */

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
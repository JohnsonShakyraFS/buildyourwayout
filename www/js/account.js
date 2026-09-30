import { getCurrentUser, updatePassword, deleteAccount } from "./auth.js";
import { supabase } from "./supabaseClient.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

const nameForm = document.getElementById("nameForm");
const displayNameInput = document.getElementById("displayNameInput");
const nameNotice = document.getElementById("nameNotice");

const emailChangeForm = document.getElementById("emailChangeForm");
const newEmailInput = document.getElementById("newEmailInput");
const emailChangeSaveBtn = document.getElementById("emailChangeSaveBtn");
const emailChangeNotice = document.getElementById("emailChangeNotice");
const emailChangeError = document.getElementById("emailChangeError");

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
const newPasswordHint = document.getElementById("newPasswordHint");
const passwordMatchHint = document.getElementById("passwordMatchHint");
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
  newEmailInput.value = user.email;

  await loadProfile(user.id);
  await loadAccountDetails(user.id);
  await loadProgressAndHistory(user.id);
});

/* ============================================================
   CHANGE EMAIL
   Supabase's default "Secure email change" sends a confirmation
   link to BOTH the current and new address — the change only
   commits once both are clicked. This matches Supabase's own
   documented default behavior, so the in-app copy sets that
   expectation up front rather than surprising anyone.
   ============================================================ */

emailChangeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  emailChangeNotice.hidden = true;
  emailChangeError.hidden = true;

  const newEmail = newEmailInput.value.trim();

  if (!newEmail) {
    emailChangeError.textContent = "Please enter an email address.";
    emailChangeError.hidden = false;
    return;
  }

  emailChangeSaveBtn.disabled = true;
  emailChangeSaveBtn.textContent = "Sending confirmation...";

  const { error } = await supabase.auth.updateUser({ email: newEmail });

  emailChangeSaveBtn.disabled = false;
  emailChangeSaveBtn.textContent = "Update Email";

  if (error) {
    console.error("Error updating email:", error);
    emailChangeError.textContent = error.message || "We couldn't start that email change. Please try again.";
    emailChangeError.hidden = false;
    return;
  }

  emailChangeNotice.textContent =
    "Check both your current and new email inboxes — click the confirmation link in each to finish changing your email.";
  emailChangeNotice.hidden = false;
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
    nameNotice.textContent = "We couldn't save your name. Check your connection and try again.";
    nameNotice.className = "auth-error";
    nameNotice.hidden = false;
    return;
  }

  nameNotice.textContent = "Name saved.";
  nameNotice.className = "auth-notice";
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
    prefsNotice.textContent = "We couldn't save your preferences. Check your connection and try again.";
    prefsNotice.className = "auth-error";
    prefsNotice.hidden = false;
    return;
  }

  prefsNotice.textContent = "Preferences saved.";
  prefsNotice.className = "auth-notice";
  prefsNotice.hidden = false;
});

function highlightSelectedPlan(plan) {
  planGrid.querySelectorAll(".plan-card").forEach(card => {
    card.classList.toggle("current-plan", card.dataset.plan === plan);
    const btn = card.querySelector(".plan-select-btn");
    btn.textContent = card.dataset.plan === plan ? "Current Plan" : "Select";
    btn.disabled = card.dataset.plan === plan;
  });

  // Only someone actually on Plus needs a way to manage/cancel a
  // real subscription — Free has nothing to manage.
  const managePlanBlock = document.getElementById("managePlanBlock");
  if (managePlanBlock) {
    managePlanBlock.classList.toggle("hidden", plan !== "plus");
  }
}

document.getElementById("managePlanBtn")?.addEventListener("click", async () => {
  const btn = document.getElementById("managePlanBtn");
  const errorEl = document.getElementById("managePlanError");
  errorEl.hidden = true;

  btn.disabled = true;
  btn.textContent = "Opening billing portal...";

  const { data, error } = await supabase.functions.invoke("create-portal-session");

  if (error || !data?.url) {
    console.error("Error opening billing portal:", error);
    btn.disabled = false;
    btn.textContent = "Manage Subscription";
    errorEl.textContent = "We couldn't open the billing portal. Please try again.";
    errorEl.hidden = false;
    return;
  }

  window.location.href = data.url;
});

planGrid.addEventListener("click", async (event) => {
  const btn = event.target.closest(".plan-select-btn");
  if (!btn || btn.disabled) return;

  const card = btn.closest(".plan-card");
  const plan = card.dataset.plan;

  // Plus is a real paid subscription — this has to go through
  // Stripe Checkout, never a direct database write, since nothing
  // client-side can be trusted to say "I actually paid."
  if (plan === "plus") {
    btn.disabled = true;
    btn.textContent = "Redirecting to checkout...";

    const { data, error } = await supabase.functions.invoke("create-checkout");

    if (error || !data?.url) {
      console.error("Error creating checkout session:", error);
      btn.disabled = false;
      btn.textContent = "Select";
      alert("We couldn't start checkout. Please try again.");
      return;
    }

    window.location.href = data.url;
    return;
  }

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
    alert("We couldn't switch your plan. Check your connection and try again.");
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

  if (error) {
    console.error("Error loading build history:", error);
    progressStats.innerHTML = `<p class="journal-error">Couldn't load your progress. Refresh the page to try again.</p>`;
    buildHistoryList.innerHTML = `<p class="journal-error">Couldn't load your build history. Refresh the page to try again.</p>`;
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
   CHANGE PASSWORD
   ============================================================ */

const MIN_PASSWORD_LENGTH = 8;

function passwordStrengthLabel(length) {
  if (length < MIN_PASSWORD_LENGTH) return null;
  if (length >= 16) return "Strong";
  if (length >= 12) return "Good";
  return "Okay";
}

function validateNewPasswordLive() {
  if (newPasswordInput.value === "") {
    newPasswordHint.textContent = "";
    newPasswordHint.className = "field-hint";
    newPasswordInput.classList.remove("field-invalid", "field-valid");
    return;
  }

  const length = newPasswordInput.value.length;
  const remaining = MIN_PASSWORD_LENGTH - length;
  const longEnough = remaining <= 0;

  if (!longEnough) {
    newPasswordHint.textContent = `${remaining} more character${remaining === 1 ? "" : "s"} needed.`;
  } else {
    const strength = passwordStrengthLabel(length);
    newPasswordHint.textContent = `Good length${strength && strength !== "Okay" ? ` — ${strength}` : ""}.`;
  }

  newPasswordHint.className = "field-hint" + (longEnough ? " valid" : " invalid");
  newPasswordInput.classList.toggle("field-invalid", !longEnough);
  newPasswordInput.classList.toggle("field-valid", longEnough);
}

function validatePasswordMatchLive() {
  if (newPasswordConfirmInput.value === "") {
    passwordMatchHint.textContent = "";
    passwordMatchHint.className = "field-hint";
    newPasswordConfirmInput.classList.remove("field-invalid", "field-valid");
    return;
  }

  const match = newPasswordInput.value === newPasswordConfirmInput.value;
  passwordMatchHint.textContent = match ? "Passwords match." : "Passwords don't match yet.";
  passwordMatchHint.className = "field-hint" + (match ? " valid" : " invalid");
  newPasswordConfirmInput.classList.toggle("field-invalid", !match);
  newPasswordConfirmInput.classList.toggle("field-valid", match);
}

newPasswordInput.addEventListener("input", () => {
  validateNewPasswordLive();
  validatePasswordMatchLive();
});
newPasswordConfirmInput.addEventListener("input", validatePasswordMatchLive);

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  passwordError.hidden = true;
  passwordNotice.hidden = true;

  if (newPasswordInput.value.length < MIN_PASSWORD_LENGTH) {
    passwordError.textContent = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    passwordError.hidden = false;
    return;
  }

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
   DELETE ACCOUNT
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
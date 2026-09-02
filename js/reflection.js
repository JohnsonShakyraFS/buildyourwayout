import { supabase } from "./supabaseClient.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { getCurrentUser } from "./auth.js";
import { moods } from "./moods.js";
import { builds } from "./builds.js";

initAuthStatus();
registerServiceWorker();

/* ============================================================
   REFLECTION PAGE
   Handles:
   - Saving reflections (1-5 mood ratings)
   - Loading the user's journal
   - Displaying saved reflections
   - Rendering the emotional trend chart
   ============================================================ */

const reflectionForm = document.getElementById("reflectionForm");
const journalEntries = document.getElementById("journalEntries");
const journalScopeNote = document.getElementById("journalScopeNote");

const moodBeforeScale = document.getElementById("moodBeforeScale");
const moodAfterScale = document.getElementById("moodAfterScale");
const moodNote = document.getElementById("moodNote");
const projectBuilt = document.getElementById("projectBuilt");
const lessonLearned = document.getElementById("lessonLearned");

const selectedMoodKey = localStorage.getItem("selectedMood");
const selectedBuildId = localStorage.getItem("selectedBuildId");

const selectedMood = selectedMoodKey ? moods[selectedMoodKey] : null;
const selectedBuild = selectedBuildId ? builds[selectedBuildId] : null;

let beforeRating = null;
let afterRating = null;
let moodTrendChartInstance = null;

const MOOD_LABELS = {
  1: "😞 Very low",
  2: "😕 Low",
  3: "😐 Okay",
  4: "🙂 Good",
  5: "😊 Great"
};

const LOW_MOOD_THRESHOLD = 2.5;
const LOOKBACK_COUNT = 3;
const SUPPORT_DISMISS_KEY = "supportBannerDismissedAt";
const SUPPORT_DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

/* ============================================================
   MOOD SCALE INTERACTION
   ============================================================ */

function setupMoodScale(container, onSelect) {
  if (!container) return;

  container.addEventListener("click", (event) => {
    const button = event.target.closest(".mood-option");
    if (!button) return;

    container.querySelectorAll(".mood-option").forEach(btn =>
      btn.classList.remove("selected")
    );
    button.classList.add("selected");

    onSelect(Number(button.dataset.value));
  });
}

setupMoodScale(moodBeforeScale, (value) => { beforeRating = value; });
setupMoodScale(moodAfterScale, (value) => { afterRating = value; });

/* ============================================================
   STATUS MESSAGE
   ============================================================ */

function showMessage(message, type = "success") {
  let messageEl = document.getElementById("reflectionMessage");

  if (!messageEl) {
    messageEl = document.createElement("div");
    messageEl.id = "reflectionMessage";
    messageEl.setAttribute("role", "status");

    reflectionForm?.prepend(messageEl);
  }

  messageEl.textContent = message;
  messageEl.className = `reflection-message ${type}`;

  messageEl.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

/* ============================================================
   AUTHENTICATION CHECK
   ============================================================ */

async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    showMessage(
      "Please sign in to save your reflection and build journal.",
      "error"
    );

    if (reflectionForm) {
      reflectionForm.querySelectorAll("input, textarea, button").forEach(el => {
        el.disabled = true;
      });
    }

    return null;
  }

  return user;
}

/* ============================================================
   EMOTIONAL TREND CHART
   ============================================================ */
   function shouldShowSupportBanner(afterValues) {
    if (afterValues.length < LOOKBACK_COUNT) return false;
  
    const recent = afterValues.slice(-LOOKBACK_COUNT);
    const avg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
  
    if (avg > LOW_MOOD_THRESHOLD) return false;
  
    const dismissedAt = Number(localStorage.getItem(SUPPORT_DISMISS_KEY) || 0);
    const cooledDown = Date.now() - dismissedAt > SUPPORT_DISMISS_COOLDOWN_MS;
  
    return cooledDown;
  }
  
  function setupSupportBanner() {
    const dismissBtn = document.getElementById("dismissSupportBanner");
    if (!dismissBtn) return;
  
    dismissBtn.addEventListener("click", () => {
      const banner = document.getElementById("supportBanner");
      if (banner) banner.classList.add("hidden");
      localStorage.setItem(SUPPORT_DISMISS_KEY, String(Date.now()));
    });
  }
  
  setupSupportBanner();
  
function describeTrend(afterValues) {
  if (afterValues.length < 2) {
    return "Complete a few more reflections to start seeing your trend.";
  }

  const midpoint = Math.floor(afterValues.length / 2) || 1;
  const earlier = afterValues.slice(0, midpoint);
  const recent = afterValues.slice(midpoint).length
    ? afterValues.slice(midpoint)
    : earlier;

  const avg = arr => arr.reduce((sum, v) => sum + v, 0) / arr.length;
  const diff = avg(recent) - avg(earlier);

  if (diff > 0.4) {
    return "↑ Improving — your recent check-ins have generally moved upward.";
  }
  if (diff < -0.4) {
    return "↓ Trending down — your recent check-ins have been lower than before.";
  }
  return "→ Holding steady — your mood has been fairly consistent.";
}

function renderMoodTrend(data) {
  const canvas = document.getElementById("moodTrendChart");
  const summaryEl = document.getElementById("moodTrendSummary");
  const supportBanner = document.getElementById("supportBanner");

  if (!canvas || !summaryEl) return;

  const chronological = [...data].reverse();

  const withMoods = chronological.filter(
    r => typeof r.mood_before === "number" && typeof r.mood_after === "number"
  );

  if (withMoods.length === 0) {
    summaryEl.textContent =
      "Complete a reflection with mood ratings to see your trend.";
    canvas.style.display = "none";
    supportBanner?.classList.add("hidden");
    return;
  }

  canvas.style.display = "block";

  const labels = withMoods.map(r =>
    new Date(r.created_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    })
  );

  const beforeValues = withMoods.map(r => r.mood_before);
  const afterValues = withMoods.map(r => r.mood_after);

  summaryEl.textContent = describeTrend(afterValues);

  if (supportBanner) {
    if (shouldShowSupportBanner(afterValues)) {
      supportBanner.classList.remove("hidden");
    } else {
      supportBanner.classList.add("hidden");
    }
  }

  if (moodTrendChartInstance) {
    moodTrendChartInstance.destroy();
  }

  moodTrendChartInstance = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Before",
          data: beforeValues,
          borderColor: "#c8bda9",
          backgroundColor: "transparent",
          tension: 0.3,
          pointRadius: 3
        },
        {
          label: "After",
          data: afterValues,
          borderColor: "#c8a96a",
          backgroundColor: "transparent",
          tension: 0.3,
          pointRadius: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 1,
          max: 5,
          ticks: { stepSize: 1 }
        }
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 10, font: { size: 11 } }
        }
      }
    }
  });
}

/* ============================================================
   LOAD USER'S JOURNAL
   ============================================================ */

async function loadJournal(user) {
  if (!journalEntries) return;

  journalEntries.innerHTML = `
    <p class="journal-loading">Loading your journal...</p>
  `;

  const { data, error } = await supabase
    .from("reflections")
    .select(`
      id,
      mood_label,
      mood_key,
      build_id,
      project,
      mood_before,
      mood_after,
      mood_note,
      lesson,
      created_at
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading reflections:", error);

    journalEntries.innerHTML = `
      <p class="journal-error">
        We couldn't load your journal right now. Please refresh and try again.
      </p>
    `;

    renderMoodTrend([]);
    return;
  }

  renderMoodTrend(data || []);

  if (!data || data.length === 0) {
    journalEntries.innerHTML = `
      <div class="empty-journal">
        <h3>Your journal is waiting for you.</h3>
        <p>
          Complete your first reflection and it will appear here.
        </p>
      </div>
    `;

    if (journalScopeNote) {
      journalScopeNote.textContent =
        "Your reflections are private to your account.";
    }

    return;
  }

  if (journalScopeNote) {
    journalScopeNote.textContent =
      `${data.length} reflection${data.length === 1 ? "" : "s"} saved • Private to your account`;
  }

  journalEntries.innerHTML = "";

  data.forEach(reflection => {
    const entry = document.createElement("article");
    entry.className = "journal-entry";

    const date = new Date(reflection.created_at);

    const formattedDate = date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    const moodName =
      reflection.mood_label ||
      moods[reflection.mood_key]?.label ||
      "Reflection";

    const beforeLabel = MOOD_LABELS[reflection.mood_before] || "—";
    const afterLabel = MOOD_LABELS[reflection.mood_after] || "—";

    const noteHtml = reflection.mood_note
      ? `
        <div class="journal-entry-section">
          <strong>In their own words</strong>
          <p>${escapeHtml(reflection.mood_note)}</p>
        </div>
      `
      : "";

    entry.innerHTML = `
      <div class="journal-entry-header">
        <div>
          <span class="journal-mood">${escapeHtml(moodName)}</span>
          <h3>${escapeHtml(reflection.project || "Build Reflection")}</h3>
        </div>

        <time datetime="${reflection.created_at}">
          ${formattedDate}
        </time>
      </div>

      <div class="journal-entry-section mood-shift">
        <span class="mood-shift-item"><strong>Before:</strong> ${beforeLabel}</span>
        <span class="mood-shift-arrow">→</span>
        <span class="mood-shift-item"><strong>After:</strong> ${afterLabel}</span>
      </div>

      ${noteHtml}

      <div class="journal-entry-section">
        <strong>What I learned</strong>
        <p>${escapeHtml(reflection.lesson)}</p>
      </div>
    `;

    journalEntries.appendChild(entry);
  });
}

/* ============================================================
   SAVE REFLECTION
   ============================================================ */

async function saveReflection(event) {
  event.preventDefault();

  const user = await getCurrentUser();

  if (!user) {
    showMessage(
      "Please sign in before saving a reflection.",
      "error"
    );

    return;
  }

  const project = projectBuilt.value.trim();
  const lesson = lessonLearned.value.trim();
  const note = moodNote.value.trim();

  if (!beforeRating || !afterRating || !project || !lesson) {
    showMessage(
      "Please select how you felt before and after, and fill out the rest of the fields.",
      "error"
    );

    return;
  }

  const submitButton = reflectionForm.querySelector(
    'button[type="submit"]'
  );

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Saving...";
  }

  const reflection = {
    user_id: user.id,

    mood_label: selectedMood?.label || "Unknown mood",
    mood_key: selectedMoodKey || null,

    build_id: selectedBuildId || null,

    project,
    mood_before: beforeRating,
    mood_after: afterRating,
    mood_note: note || null,
    lesson
  };

  const { data, error } = await supabase
    .from("reflections")
    .insert(reflection)
    .select()
    .single();

  if (error) {
    console.error("Error saving reflection:", error);

    showMessage(
      "We couldn't save your reflection. Please try again.",
      "error"
    );

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "♡ Save Reflection";
    }

    return;
  }

  console.log("Reflection saved:", data);

  const delta = afterRating - beforeRating;
  let shiftPhrase = "stayed about the same";
  if (delta >= 1) shiftPhrase = "improved";
  else if (delta <= -1) shiftPhrase = "dropped a bit";

  showMessage(
    `Saved to your Build Journal. Your mood ${shiftPhrase} during this build ` +
    `(${MOOD_LABELS[beforeRating]} → ${MOOD_LABELS[afterRating]}). ♡`,
    "success"
  );

  reflectionForm.reset();
  beforeRating = null;
  afterRating = null;
  document.querySelectorAll(".mood-option.selected").forEach(btn =>
    btn.classList.remove("selected")
  );

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = "♡ Save Reflection";
  }

  await loadJournal(user);
}

/* ============================================================
   HTML ESCAPING
   ============================================================ */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ============================================================
   INITIALIZE
   ============================================================ */

async function initReflectionPage() {
  if (!reflectionForm) return;

  const user = await requireUser();

  if (!user) return;

  if (selectedBuild?.title && !projectBuilt.value) {
    projectBuilt.value = selectedBuild.title;
  }

  await loadJournal(user);
}

if (reflectionForm) {
  reflectionForm.addEventListener("submit", saveReflection);
  initReflectionPage();
}
import { supabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { initMainNav } from "./mainNav.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
initMainNav();
registerServiceWorker();

/* ============================================================
   JOURNAL PAGE
   Read-only view of past reflections: emotional trend chart,
   support banner for sustained low mood, and the list of past
   entries. No save/submit logic lives here — that stays on
   reflection.html, which is reached only from the end of a
   guided build.
   ============================================================ */

const journalEntries = document.getElementById("journalEntries");
const journalScopeNote = document.getElementById("journalScopeNote");

const MOOD_LABELS = {
  1: "😞 Very low",
  2: "😕 Low",
  3: "😐 Okay",
  4: "🙂 Good",
  5: "😊 Great"
};

let moodTrendChartInstance = null;
let currentUser = null;

const LOW_MOOD_THRESHOLD = 2.5;
const LOOKBACK_COUNT = 3;
const SUPPORT_DISMISS_KEY = "supportBannerDismissedAt";
const SUPPORT_DISMISS_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

/* ============================================================
   EMOTIONAL TREND CHART
   ============================================================ */

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
   LOAD PAST REFLECTIONS
   ============================================================ */

async function loadJournal(user) {
  if (!journalEntries) return;

  journalEntries.innerHTML = `
    <p class="journal-loading"><span class="spinner"></span> Loading your journal...</p>
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
        We couldn't load your journal right now. Refresh the page to try again.
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
          Complete your first build and reflection, and it will appear here.
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
          <h3>${escapeHtml(reflection.project || "Build Reflection")}</h3>
        </div>

        <div class="journal-entry-header-right">
          <time datetime="${reflection.created_at}">
            ${formattedDate}
          </time>
          <button type="button" class="journal-delete-btn" data-id="${reflection.id}" aria-label="Delete this build">
            ✕
          </button>
        </div>
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

    const deleteBtn = entry.querySelector(".journal-delete-btn");
    deleteBtn.addEventListener("click", () => deleteReflection(reflection.id));

    journalEntries.appendChild(entry);
  });
}

/* ============================================================
   DELETE A BUILD
   ============================================================ */

async function deleteReflection(id) {
  const confirmed = window.confirm(
    "Delete this build? This can't be undone."
  );
  if (!confirmed) return;

  const errorEl = document.getElementById("journalActionError");
  if (errorEl) errorEl.hidden = true;

  const { error } = await supabase
    .from("reflections")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting reflection:", error);
    if (errorEl) {
      errorEl.textContent = "We couldn't delete that build. Check your connection and try again.";
      errorEl.hidden = false;
      errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  await loadJournal(currentUser);
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

async function initJournalPage() {
  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;
  await loadJournal(user);
}

initJournalPage();
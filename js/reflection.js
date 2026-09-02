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
   - Saving reflections
   - Loading the user's journal
   - Displaying saved reflections
   ============================================================ */

const reflectionForm = document.getElementById("reflectionForm");
const journalEntries = document.getElementById("journalEntries");
const journalScopeNote = document.getElementById("journalScopeNote");

const beforeFeeling = document.getElementById("beforeFeeling");
const afterFeeling = document.getElementById("afterFeeling");
const projectBuilt = document.getElementById("projectBuilt");
const lessonLearned = document.getElementById("lessonLearned");

const selectedMoodKey = localStorage.getItem("selectedMood");
const selectedBuildId = localStorage.getItem("selectedBuildId");

const selectedMood = selectedMoodKey ? moods[selectedMoodKey] : null;
const selectedBuild = selectedBuildId ? builds[selectedBuildId] : null;


/* ============================================================
   STATUS MESSAGE
   Creates a message area without requiring another HTML element.
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
      before_feeling,
      after_feeling,
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

    return;
  }

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

      <div class="journal-entry-section">
        <strong>Before building</strong>
        <p>${escapeHtml(reflection.before_feeling)}</p>
      </div>

      <div class="journal-entry-section">
        <strong>After building</strong>
        <p>${escapeHtml(reflection.after_feeling)}</p>
      </div>

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

  const before = beforeFeeling.value.trim();
  const after = afterFeeling.value.trim();
  const project = projectBuilt.value.trim();
  const lesson = lessonLearned.value.trim();

  if (!before || !after || !project || !lesson) {
    showMessage(
      "Please complete all reflection fields before saving.",
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
    before_feeling: before,
    after_feeling: after,
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

  showMessage(
    "Your reflection has been saved to your Build Journal. ♡",
    "success"
  );

  reflectionForm.reset();

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = "♡ Save Reflection";
  }

  await loadJournal(user);
}


/* ============================================================
   HTML ESCAPING
   Prevents user-entered reflection text from being interpreted
   as HTML when displayed in the journal.
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

  /*
    Pre-fill the project name from the build the user just completed.
    The user can still edit it.
  */
  if (selectedBuild?.title && !projectBuilt.value) {
    projectBuilt.value = selectedBuild.title;
  }

  await loadJournal(user);
}

if (reflectionForm) {
  reflectionForm.addEventListener("submit", saveReflection);
  initReflectionPage();
}
import { moods } from "./moods.js";
import { builds } from "./builds.js";
import { initAuthStatus } from "./authStatus.js";
import { initMainNav } from "./mainNav.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { getCurrentUser } from "./auth.js";
import { supabase } from "./supabaseClient.js";

initAuthStatus();
initMainNav();
registerServiceWorker();

const user = await getCurrentUser();
if (!user) {
  window.location.href = "login.html";
}

const container = document.getElementById("libraryContent");
const filterBar = document.getElementById("difficultyFilter");

const DIFFICULTY_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced"
};

let userPlan = "free";
let activeDifficulty = "all";

async function loadUserPlan() {
  const { data, error } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error loading plan:", error);
    return;
  }

  userPlan = data?.plan || "free";
}

const PLAN_RANK = { free: 0, plus: 1, premium: 2 };

function planUnlocks(requiredPlan) {
  return PLAN_RANK[userPlan] >= PLAN_RANK[requiredPlan];
}

function renderLibrary() {
  container.innerHTML = "";

  let anyRendered = false;

  Object.entries(moods).forEach(([moodKey, mood]) => {
    const visibleBuilds = mood.builds.filter(buildId => {
      const build = builds[buildId];
      if (!build) return false;
      return activeDifficulty === "all" || build.difficulty === activeDifficulty;
    });

    if (visibleBuilds.length === 0) return;

    anyRendered = true;

    const section = document.createElement("section");
    section.className = "library-mood-section";

    const heading = document.createElement("h2");
    heading.className = "library-mood-heading";
    heading.innerHTML = `<span class="mood-icon ${mood.iconColor}">${mood.icon}</span> ${mood.label}`;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "library-grid";

    visibleBuilds.forEach(buildId => {
      const build = builds[buildId];
      const locked = !planUnlocks(build.requiredPlan || "free");

      const card = document.createElement("article");
      card.className = "library-card" + (locked ? " library-card-locked" : "");

      const difficultyLabel = DIFFICULTY_LABELS[build.difficulty] || "Beginner";

      card.innerHTML = `
        <div class="library-card-top">
          <h3>${build.title}</h3>
          <span class="difficulty-badge difficulty-${build.difficulty}">${difficultyLabel}</span>
        </div>
        <p>${build.description}</p>
        <button type="button" class="btn secondary-btn library-try-btn" ${locked ? "disabled" : ""}>
          ${locked ? `Requires ${build.requiredPlan}` : "Try This Build"}
        </button>
      `;

      const tryBtn = card.querySelector(".library-try-btn");
      if (!locked) {
        tryBtn.addEventListener("click", () => {
          localStorage.setItem("selectedMood", moodKey);
          localStorage.setItem("selectedBuildId", buildId);
          window.location.href = "project.html";
        });
      }

      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });

  if (!anyRendered) {
    const difficultyLabel = DIFFICULTY_LABELS[activeDifficulty] || "that difficulty";
    container.innerHTML = `
      <div class="empty-journal library-empty-state">
        <h3>No ${difficultyLabel.toLowerCase()} builds yet.</h3>
        <p>Try a different difficulty, or browse everything.</p>
        <button type="button" class="btn secondary-btn" id="clearDifficultyFilterBtn">
          Show All Builds
        </button>
      </div>
    `;

    const clearBtn = document.getElementById("clearDifficultyFilterBtn");
    clearBtn.addEventListener("click", () => {
      activeDifficulty = "all";
      filterBar.querySelectorAll(".difficulty-filter-btn").forEach(b =>
        b.classList.toggle("active", b.dataset.difficulty === "all")
      );
      renderLibrary();
    });
  }
}

if (filterBar) {
  filterBar.addEventListener("click", (event) => {
    const btn = event.target.closest(".difficulty-filter-btn");
    if (!btn) return;

    filterBar.querySelectorAll(".difficulty-filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    activeDifficulty = btn.dataset.difficulty;
    renderLibrary();
  });
}

await loadUserPlan();
renderLibrary();
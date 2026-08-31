import { moods } from "./moods.js";
import { builds } from "./builds.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
registerServiceWorker();

const container = document.getElementById("libraryContent");

Object.entries(moods).forEach(([moodKey, mood]) => {
  const section = document.createElement("section");
  section.className = "library-mood-section";

  const heading = document.createElement("h2");
  heading.className = "library-mood-heading";
  heading.innerHTML = `<span class="mood-icon ${mood.iconColor}">${mood.icon}</span> ${mood.label}`;
  section.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = "library-grid";

  mood.builds.forEach(buildId => {
    const build = builds[buildId];
    if (!build) return;

    const card = document.createElement("article");
    card.className = "library-card";
    card.innerHTML = `
      <h3>${build.title}</h3>
      <p>${build.description}</p>
      <button type="button" class="btn secondary-btn library-try-btn">Try This Build</button>
    `;

    const tryBtn = card.querySelector(".library-try-btn");
    tryBtn.addEventListener("click", () => {
      localStorage.setItem("selectedMood", moodKey);
      localStorage.setItem("selectedBuildId", buildId);
      window.location.href = "project.html";
    });

    grid.appendChild(card);
  });

  section.appendChild(grid);
  container.appendChild(section);
});
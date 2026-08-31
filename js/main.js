import { moods, pickBuildForMood, pickBuildForMoodAccount } from "./moods.js";
import { builds } from "./builds.js";
import { initAuthStatus } from "./authStatus.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { getCurrentUser } from "./auth.js";

initAuthStatus();
registerServiceWorker();

/* ------------------------------------------------------------
   Renders a build's html/css/js into a single iframe document.
   Shared by both the mini-preview and the guided workspace so
   there is exactly one place that knows how to render a build.
   ------------------------------------------------------------ */
function renderDoc(state) {
  return `
    <!DOCTYPE html>
    <html>
      <head><style>${state.css}</style></head>
      <body>
        ${state.html}
        <script>${state.js}<\/script>
      </body>
    </html>
  `;
}

/* ==============================================
   MOOD PAGE LOGIC - Runs only on mood.html
   Cards are generated from moods.js so adding a
   new mood never requires touching this HTML.
   ============================================== */
if (window.location.pathname.includes("mood.html")) {
  const moodGrid = document.getElementById("moodGrid");

  if (moodGrid) {
    Object.entries(moods).forEach(([key, mood], index) => {
      const button = document.createElement("button");
      button.className = "mood-card" + (index === 0 ? " active-mood" : "");
      button.innerHTML = `
        <span class="mood-icon ${mood.iconColor}">${mood.icon}</span>
        <div>
          <h2>${mood.label}</h2>
          <p>${mood.tagline}</p>
        </div>
      `;
      button.addEventListener("click", () => selectMood(key));
      moodGrid.appendChild(button);
    });
  }
}

/* ========================================================
   MOOD SELECTION - picks a build for the chosen mood
   (avoiding a repeat of the last build for that mood, when
   more than one option exists) and moves to project.html
   ======================================================== */
window.selectMood = async function (moodKey) {
  const user = await getCurrentUser();

  const buildId = user
    ? await pickBuildForMoodAccount(moodKey, user.id)
    : pickBuildForMood(moodKey);

  if (!buildId) return;

  localStorage.setItem("selectedMood", moodKey);
  localStorage.setItem("selectedBuildId", buildId);
  window.location.href = "project.html";
};

/* ==============================================
   PROJECT PAGE LOGIC - Runs only on project.html
   ============================================== */
if (window.location.pathname.includes("project.html")) {
  const moodKey = localStorage.getItem("selectedMood");
  const buildId = localStorage.getItem("selectedBuildId");
  const mood = moods[moodKey];
  const build = builds[buildId];

  if (!mood || !build) {
    window.location.href = "mood.html";
  } else {

    /* -------------------------
       Load selected build info
       ------------------------- */
    const titleEl = document.getElementById("title");
    const descEl = document.getElementById("description");
    const stepsList = document.getElementById("steps");

    titleEl.textContent = build.title;
    descEl.textContent = build.description;

    stepsList.innerHTML = "";
    build.steps.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      stepsList.appendChild(li);
    });

    /* -------------------------------------------------------
       DYNAMIC MINI PREVIEW - a live, working demo of the build
       rendered in a small iframe. Fully generic: works for any
       build without needing per-mood markup.
       ------------------------------------------------------- */
    const miniPreview = document.getElementById("miniPreview");
    if (miniPreview) {
      const demoFrame = document.createElement("iframe");
      demoFrame.className = "mini-preview-frame";
      demoFrame.title = "Preview of " + build.title;
      demoFrame.srcdoc = renderDoc(build.initialState);
      miniPreview.appendChild(demoFrame);
    }

    /* ======================================================================
       BUILT-IN CODING EXPERIENCE - beginner step-by-step editor
       Works against a private copy of the build's state so edits never
       mutate the shared build definition in builds.js.
       ====================================================================== */
    const startGuidedBuild = document.getElementById("startGuidedBuild");
    const codeWorkspace = document.getElementById("codeWorkspace");

    const stepCounter = document.getElementById("stepCounter");
    const guidedStepTitle = document.getElementById("guidedStepTitle");
    const guidedInstructions = document.getElementById("guidedInstructions");
    const stepEditor = document.getElementById("stepEditor");
    const editorTip = document.getElementById("editorTip");

    const applyStep = document.getElementById("applyStep");
    const prevStep = document.getElementById("prevStep");
    const nextStep = document.getElementById("nextStep");
    const previewFrame = document.getElementById("previewFrame");

    let currentStep = 0;
    const buildState = JSON.parse(JSON.stringify(build.initialState));
    const beginnerSteps = build.guidedSteps;

    function updatePreview() {
      if (!previewFrame) return;
      previewFrame.srcdoc = renderDoc(buildState);
    }

    function renderStep() {
      const step = beginnerSteps[currentStep];

      stepCounter.textContent = `Step ${currentStep + 1} of ${beginnerSteps.length}`;
      guidedStepTitle.textContent = step.title;
      guidedInstructions.textContent = step.instructions;
      editorTip.textContent = step.tip;
      stepEditor.value = step.starterCode;

      prevStep.disabled = currentStep === 0;

      if (currentStep === beginnerSteps.length - 1) {
        stepEditor.disabled = true;
        applyStep.style.display = "none";
        nextStep.textContent = "Go to Reflection";
      } else {
        stepEditor.disabled = false;
        applyStep.style.display = "inline-flex";
        nextStep.textContent = "Next Step";
      }

      updatePreview();
    }

    if (startGuidedBuild) {
      startGuidedBuild.addEventListener("click", function () {
        codeWorkspace.classList.remove("hidden");
        renderStep();
        codeWorkspace.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (applyStep) {
      applyStep.addEventListener("click", function () {
        beginnerSteps[currentStep].apply(stepEditor.value, buildState);
        updatePreview();
      });
    }

    if (nextStep) {
      nextStep.addEventListener("click", function () {
        beginnerSteps[currentStep].apply(stepEditor.value, buildState);

        if (currentStep < beginnerSteps.length - 1) {
          currentStep++;
          renderStep();
        } else {
          window.location.href = "reflection.html";
        }
      });
    }

    if (prevStep) {
      prevStep.addEventListener("click", function () {
        if (currentStep > 0) {
          currentStep--;
          renderStep();
        }
      });
    }
  }
}
import { moods, pickBuildForMood, pickBuildForMoodAccount } from "./moods.js";
import { builds } from "./builds.js";
import { initAuthStatus } from "./authStatus.js";
import { initMainNav } from "./mainNav.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { getCurrentUser } from "./auth.js";
import { supabase } from "./supabaseClient.js";

initAuthStatus();
initMainNav();
registerServiceWorker();

/* ==============================================
   ACCESS GATE
   mood.html and project.html are the actual product —
   guests get bounced to login before anything renders.
   ============================================== */
const GATED_PAGES = ["mood.html", "project.html"];
const isGatedPage = GATED_PAGES.some(page => window.location.pathname.includes(page));

let gateUser = null;
if (isGatedPage) {
  gateUser = await getCurrentUser();
  if (!gateUser) {
    window.location.href = "login.html";
  }
}

if (!isGatedPage || gateUser) {

/* ------------------------------------------------------------
   Renders a build's html/css/js into a single iframe document.
   Also injects a tiny error handler so a runtime mistake in the
   user's JS gets reported back to the parent page instead of
   failing silently.
   ------------------------------------------------------------ */
function renderDoc(state) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${state.css}</style>
        <script>
          window.onerror = function (message) {
            window.parent.postMessage(
              { type: "buildPreviewError", message: message },
              "*"
            );
            return true;
          };
        <\/script>
      </head>
      <body>
        ${state.html}
        <script>${state.js}<\/script>
      </body>
    </html>
  `;
}

/* ------------------------------------------------------------
   Renders a build at a fixed, stable "design width" (so its own
   responsive CSS like `width: min(420px, 90%)` always resolves
   the same way), measures its real height once loaded, then
   scales the whole iframe down from the outside to fit whatever
   size its actual preview container is. Re-scales on window
   resize so it stays correct if the layout shifts.
   ------------------------------------------------------------ */
const BUILD_DESIGN_WIDTH = 480;

function fitIframeToContainer(iframe) {
  iframe.style.width = BUILD_DESIGN_WIDTH + "px";
  iframe.style.border = "none";
  iframe.style.transformOrigin = "top left";

  function applyScale() {
    const container = iframe.parentElement;
    if (!container) return;

    const contentHeight = iframe.dataset.contentHeight;
    if (!contentHeight) return;

    const containerWidth = container.clientWidth;
    const scale = Math.min(containerWidth / BUILD_DESIGN_WIDTH, 1);

    iframe.style.transform = "scale(" + scale + ")";
    container.style.overflow = "hidden";
    container.style.height = (Number(contentHeight) * scale) + "px";
  }

  /* Polls (via requestAnimationFrame) until the iframe's document
     actually has rendered content, instead of relying on a single
     'load' event firing at a predictable time. srcdoc iframes can
     finish loading before a 'load' listener gets attached if it's
     assigned in the wrong order elsewhere in the code — polling
     means we can't miss that window no matter what order things
     happen in. */
  function measureAndScale() {
    const doc = iframe.contentDocument;
    if (!doc || !doc.body || doc.body.scrollHeight === 0) {
      requestAnimationFrame(measureAndScale);
      return;
    }
    iframe.dataset.contentHeight = doc.body.scrollHeight;
    iframe.style.height = doc.body.scrollHeight + "px";
    applyScale();
  }

  iframe.addEventListener("load", measureAndScale);
  requestAnimationFrame(measureAndScale);
  window.addEventListener("resize", applyScale);
}

/* ==============================================
   MOOD PAGE LOGIC - Runs only on mood.html
   ============================================== */
if (window.location.pathname.includes("mood.html")) {
  const moodGrid = document.getElementById("moodGrid");

  if (moodGrid) {
    Object.entries(moods).forEach(([key, mood], index) => {
      const button = document.createElement("button");
      button.className = "mood-card";
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

    document.getElementById("projectInfoCard").classList.remove("hidden-until-ready");
    document.getElementById("stepsCard").classList.remove("hidden-until-ready");
    document.getElementById("buildLoadingIndicator")?.remove();

    const miniPreview = document.getElementById("miniPreview");
    if (miniPreview) {
      const demoFrame = document.createElement("iframe");
      demoFrame.className = "mini-preview-frame";
      demoFrame.title = "Preview of " + build.title;
      fitIframeToContainer(demoFrame);
      demoFrame.srcdoc = renderDoc(build.initialState);
      miniPreview.appendChild(demoFrame);
    }

    const startGuidedBuild = document.getElementById("startGuidedBuild");
    const codeWorkspace = document.getElementById("codeWorkspace");

    const stepCounter = document.getElementById("stepCounter");
    const guidedStepTitle = document.getElementById("guidedStepTitle");
    const guidedInstructions = document.getElementById("guidedInstructions");
    const stepEditor = document.getElementById("stepEditor");
    const editorTip = document.getElementById("editorTip");
    const editorError = document.getElementById("editorError");

    const applyStep = document.getElementById("applyStep");
    const prevStep = document.getElementById("prevStep");
    const nextStep = document.getElementById("nextStep");
    const previewFrame = document.getElementById("previewFrame");

    if (previewFrame) {
      fitIframeToContainer(previewFrame);
    }

    const resumeBanner = document.getElementById("resumeBanner");
    const resumeBtn = document.getElementById("resumeBtn");
    const startOverBtn = document.getElementById("startOverBtn");

    let currentStep = 0;
    let buildState = JSON.parse(JSON.stringify(build.initialState));
    const beginnerSteps = build.guidedSteps;

    /* ------------------------------------------------------------
       CODE EDITOR (syntax highlighting)
       ------------------------------------------------------------ */
    let cmEditor = null;
    if (stepEditor && window.CodeMirror) {
      cmEditor = CodeMirror.fromTextArea(stepEditor, {
        lineNumbers: true,
        mode: "javascript",
        theme: "default",
        viewportMargin: Infinity,
        lineWrapping: true
      });
    }

    function getEditorValue() {
      return cmEditor ? cmEditor.getValue() : stepEditor.value;
    }

    function setEditorValue(value) {
      if (cmEditor) {
        cmEditor.setValue(value);
      } else {
        stepEditor.value = value;
      }
    }

    function setEditorMode(mode) {
      if (cmEditor) cmEditor.setOption("mode", mode);
    }

    function setEditorReadOnly(readOnly) {
      if (cmEditor) {
        cmEditor.setOption("readOnly", readOnly);
      } else {
        stepEditor.disabled = readOnly;
      }
    }

    function pickModeForCode(code) {
      const trimmed = code.trim();
      if (trimmed.startsWith("<")) return "htmlmixed";
      if (/^[a-zA-Z-]+\s*:\s*.+;?\s*$/.test(trimmed) && !/^(const|let|var|function)\b/.test(trimmed)) {
        return "css";
      }
      return "javascript";
    }

    /* ------------------------------------------------------------
       ERROR BANNER
       ------------------------------------------------------------ */
    function showEditorError(message) {
      if (!editorError) return;
      editorError.textContent = message;
      editorError.hidden = false;
    }

    function hideEditorError() {
      if (!editorError) return;
      editorError.hidden = true;
    }

    window.addEventListener("message", (event) => {
      if (event.data && event.data.type === "buildPreviewError") {
        showEditorError("Your build hit an error while running: " + event.data.message);
      }
    });

    function updatePreview() {
      if (!previewFrame) return;
      previewFrame.srcdoc = renderDoc(buildState);
    }

    /* ------------------------------------------------------------
       SAVE / RESUME PROGRESS
       Saved per user + build id. Deleted once the build is
       actually finished (user reaches reflection).
       ------------------------------------------------------------ */
    async function saveProgress() {
      if (!gateUser) return;

      const { error } = await supabase
        .from("build_progress")
        .upsert({
          user_id: gateUser.id,
          build_id: buildId,
          mood_key: moodKey,
          current_step: currentStep,
          build_state: buildState,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error("Error saving build progress:", error);
      }
    }

    async function clearProgress() {
      if (!gateUser) return;

      const { error } = await supabase
        .from("build_progress")
        .delete()
        .eq("user_id", gateUser.id)
        .eq("build_id", buildId);

      if (error) {
        console.error("Error clearing build progress:", error);
      }
    }

    async function checkForSavedProgress() {
      if (!gateUser || !resumeBanner) return;

      const { data, error } = await supabase
        .from("build_progress")
        .select("current_step, build_state")
        .eq("user_id", gateUser.id)
        .eq("build_id", buildId)
        .maybeSingle();

      if (error) {
        console.error("Error checking build progress:", error);
        return;
      }

      if (data) {
        resumeBanner.classList.remove("hidden");

        resumeBtn.addEventListener("click", () => {
          currentStep = data.current_step;
          buildState = data.build_state;
          resumeBanner.classList.add("hidden");
          codeWorkspace.classList.remove("hidden");
          renderStep();
          codeWorkspace.scrollIntoView({ behavior: "smooth" });
        }, { once: true });

        startOverBtn.addEventListener("click", async () => {
          await clearProgress();
          currentStep = 0;
          buildState = JSON.parse(JSON.stringify(build.initialState));
          resumeBanner.classList.add("hidden");
          codeWorkspace.classList.remove("hidden");
          renderStep();
          codeWorkspace.scrollIntoView({ behavior: "smooth" });
        }, { once: true });
      }
    }

    function runCurrentStep() {
      hideEditorError();
      try {
        beginnerSteps[currentStep].apply(getEditorValue(), buildState);
      } catch (err) {
        console.error("Error applying step:", err);
        showEditorError("Something went wrong applying your changes: " + err.message);
        return false;
      }
      updatePreview();
      saveProgress();
      return true;
    }

    function renderStep() {
      const step = beginnerSteps[currentStep];

      stepCounter.textContent = `Step ${currentStep + 1} of ${beginnerSteps.length}`;
      guidedStepTitle.textContent = step.title;
      guidedInstructions.textContent = step.instructions;
      editorTip.textContent = step.tip;

      hideEditorError();
      setEditorValue(step.starterCode);
      setEditorMode(pickModeForCode(step.starterCode));

      prevStep.disabled = currentStep === 0;

      if (currentStep === beginnerSteps.length - 1) {
        setEditorReadOnly(true);
        applyStep.style.display = "none";
        nextStep.textContent = "Go to Reflection";
      } else {
        setEditorReadOnly(false);
        applyStep.style.display = "inline-flex";
        nextStep.textContent = "Next Step";
      }

      updatePreview();

      if (cmEditor) {
        setTimeout(() => cmEditor.refresh(), 0);
      }
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
        runCurrentStep();
      });
    }

    if (nextStep) {
      nextStep.addEventListener("click", async function () {
        const ok = runCurrentStep();
        if (!ok) return;

        if (currentStep < beginnerSteps.length - 1) {
          currentStep++;
          renderStep();
          saveProgress();
        } else {
          await clearProgress();
          window.location.href = "reflection.html";
        }
      });
    }

    if (prevStep) {
      prevStep.addEventListener("click", function () {
        if (currentStep > 0) {
          currentStep--;
          renderStep();
          saveProgress();
        }
      });
    }

    checkForSavedProgress();
  }
}

} // end access gate wrapper
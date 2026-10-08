import { supabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { initMainNav } from "./mainNav.js";
import { registerServiceWorker } from "./registerServiceWorker.js";

initAuthStatus();
initMainNav();
registerServiceWorker();

/* ============================================================
   SANDBOX (Plus)
   A free-form HTML / CSS / JavaScript editor with a live preview.
   Creations save into the same saved_builds table as guided
   builds, so they show up in My Builds.

   - Free accounts see an upgrade panel instead of the editor.
     Saving is also blocked in the database for non-Plus users,
     so this isn't only a hidden button.
   - ?id=<saved build id> opens an existing build. A Sandbox
     creation is edited in place; a guided build is "remixed" —
     its code is copied in and saving creates a NEW row, so the
     original is never overwritten.
   - Drafts autosave locally, so a crashed tab (an accidental
     infinite loop in someone's JavaScript can freeze it) doesn't
     lose their work.
   ============================================================ */

const STARTER = {
  html: `<h1>Hello there</h1>
<p>Start building something that feels like you.</p>`,
  css: `body {
  font-family: system-ui, sans-serif;
  padding: 24px;
  background: #eef3f1;
  color: #212c29;
}`,
  js: `// Click the heading to change it.
const heading = document.querySelector("h1");

heading.addEventListener("click", () => {
  heading.textContent = "You made this.";
});`
};

const MODES = { html: "htmlmixed", css: "css", js: "javascript" };
const LANGS = ["html", "css", "js"];

const lockedPanel = document.getElementById("sandboxLocked");
const appPanel = document.getElementById("sandboxApp");
const titleInput = document.getElementById("sandboxTitle");
const previewFrame = document.getElementById("previewFrame");
const errorEl = document.getElementById("sandboxError");
const statusEl = document.getElementById("sandboxStatus");
const runBtn = document.getElementById("sandboxRun");
const saveBtn = document.getElementById("sandboxSave");

const textareas = {
  html: document.getElementById("editor-html"),
  css: document.getElementById("editor-css"),
  js: document.getElementById("editor-js")
};

const editors = { html: null, css: null, js: null };

let currentUser = null;
let currentSavedId = null;
let draftTimer = null;

/* ------------------------------------------------------------
   Editor helpers (CodeMirror when it loaded, plain textarea if
   the CDN was blocked — the page still works either way)
   ------------------------------------------------------------ */

function getCode(lang) {
  return editors[lang] ? editors[lang].getValue() : textareas[lang].value;
}

function setCode(lang, value) {
  if (editors[lang]) {
    editors[lang].setValue(value);
  } else {
    textareas[lang].value = value;
  }
}

function initEditors() {
  LANGS.forEach((lang) => {
    if (window.CodeMirror) {
      editors[lang] = CodeMirror.fromTextArea(textareas[lang], {
        lineNumbers: true,
        mode: MODES[lang],
        lineWrapping: true,
        viewportMargin: Infinity
      });
      editors[lang].on("change", scheduleDraftSave);
    } else {
      textareas[lang].addEventListener("input", scheduleDraftSave);
    }
  });
}

function switchTab(lang) {
  document.querySelectorAll(".sandbox-tab").forEach((tab) => {
    const active = tab.dataset.lang === lang;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  LANGS.forEach((l) => {
    document.getElementById(`pane-${l}`).hidden = l !== lang;
  });

  // CodeMirror can't measure itself while hidden, so it needs a
  // nudge once its pane becomes visible.
  if (editors[lang]) {
    setTimeout(() => editors[lang].refresh(), 0);
  }
}

/* ------------------------------------------------------------
   Preview
   ------------------------------------------------------------ */

function renderDoc({ html, css, js }) {
  // A literal "</script" inside someone's JavaScript would end the
  // script tag early and break the preview — neutralize it.
  const safeJs = js.replace(/<\/script/gi, "<\\/script");

  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      html, body { overflow-x: hidden; }
      body { overflow-wrap: break-word; word-break: break-word; }
    </style>
    <style>${css}</style>
    <script>
      window.onerror = function (message) {
        window.parent.postMessage(
          { type: "sandboxPreviewError", message: String(message) },
          "*"
        );
        return true;
      };
    <\/script>
  </head>
  <body>
    ${html}
    <script>${safeJs}<\/script>
  </body>
</html>`;
}

function runPreview() {
  hideError();
  previewFrame.srcdoc = renderDoc({
    html: getCode("html"),
    css: getCode("css"),
    js: getCode("js")
  });
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function hideError() {
  errorEl.hidden = true;
}

window.addEventListener("message", (event) => {
  // The preview runs in a sandboxed frame with an opaque origin, so
  // we identify it by the window it came from instead.
  if (event.source !== previewFrame.contentWindow) return;

  if (event.data && event.data.type === "sandboxPreviewError") {
    showError("Your code hit an error while running: " + event.data.message);
  }
});

/* ------------------------------------------------------------
   Draft autosave (local to this device, per account)
   ------------------------------------------------------------ */

function draftKey() {
  return `sandboxDraft:${currentUser.id}`;
}

function scheduleDraftSave() {
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    try {
      localStorage.setItem(
        draftKey(),
        JSON.stringify({
          title: titleInput.value,
          html: getCode("html"),
          css: getCode("css"),
          js: getCode("js"),
          savedId: currentSavedId
        })
      );
    } catch (err) {
      // Storage can be unavailable or full — drafts are a
      // convenience, never something worth interrupting for.
    }
  }, 500);
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(draftKey());
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function applyContent({ title, html, css, js }) {
  titleInput.value = title || "";
  setCode("html", html ?? "");
  setCode("css", css ?? "");
  setCode("js", js ?? "");
}

/* ------------------------------------------------------------
   Saving
   ------------------------------------------------------------ */

function setStatus(message, withLink) {
  statusEl.textContent = message;

  if (withLink) {
    const link = document.createElement("a");
    link.href = "my-builds.html";
    link.textContent = " View My Builds";
    statusEl.appendChild(link);
  }
}

async function saveCreation() {
  saveBtn.disabled = true;
  setStatus("Saving...");

  const payload = {
    title: (titleInput.value.trim() || "Untitled sandbox").slice(0, 80),
    html: getCode("html"),
    css: getCode("css"),
    js: getCode("js"),
    updated_at: new Date().toISOString()
  };

  try {
    if (currentSavedId) {
      const { data, error } = await supabase
        .from("saved_builds")
        .update(payload)
        .eq("id", currentSavedId)
        .select("id");

      if (error) throw error;

      if (data && data.length > 0) {
        setStatus("Saved.", true);
        scheduleDraftSave();
        return;
      }

      // The row is gone (deleted from My Builds in another tab) —
      // fall through and save it as a fresh creation instead.
      currentSavedId = null;
    }

    const { data, error } = await supabase
      .from("saved_builds")
      .insert({
        user_id: currentUser.id,
        build_id: null,
        mood_key: null,
        source: "sandbox",
        ...payload
      })
      .select("id")
      .single();

    if (error) throw error;

    currentSavedId = data.id;
    history.replaceState(null, "", `sandbox.html?id=${data.id}`);
    setStatus("Saved to My Builds.", true);
    scheduleDraftSave();
  } catch (err) {
    console.error("Error saving sandbox creation:", err);

    // 42501 = row-level security refused the write (not on Plus)
    if (err && err.code === "42501") {
      setStatus("Saving Sandbox creations is a Plus feature.");
    } else {
      setStatus("We couldn't save that. Check your connection and try again.");
    }
  } finally {
    saveBtn.disabled = false;
  }
}

/* ------------------------------------------------------------
   Startup
   ------------------------------------------------------------ */

async function loadFromParam(id) {
  const { data, error } = await supabase
    .from("saved_builds")
    .select("id, title, html, css, js, source")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return false;

  if (data.source === "sandbox") {
    // Editing one of their own Sandbox creations in place
    currentSavedId = data.id;
    applyContent(data);
  } else {
    // Remixing a guided build: copy the code, but save as a new
    // creation so the original build is left untouched.
    applyContent({ ...data, title: `${data.title} (remix)` });
  }

  return true;
}

async function init() {
  currentUser = await getCurrentUser();

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (profile?.plan !== "plus") {
    lockedPanel.classList.remove("hidden");
    return;
  }

  appPanel.classList.remove("hidden");
  initEditors();

  const id = new URLSearchParams(window.location.search).get("id");
  let loaded = false;

  if (id) {
    loaded = await loadFromParam(id);
  }

  if (!loaded) {
    const draft = loadDraft();
    if (draft) {
      currentSavedId = draft.savedId || null;
      applyContent(draft);
    } else {
      applyContent({ title: "", ...STARTER });
    }
  }

  titleInput.addEventListener("input", scheduleDraftSave);

  document.querySelectorAll(".sandbox-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.lang));
  });

  runBtn.addEventListener("click", runPreview);
  saveBtn.addEventListener("click", saveCreation);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      runPreview();
    }
  });

  runPreview();
}

init();
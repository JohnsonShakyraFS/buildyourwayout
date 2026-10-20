import { redirectLoggedOut } from "./siteGate.js";
import { supabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { initMainNav } from "./mainNav.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { SNIPPETS } from "./sandboxSnippets.js";
import { checkSandboxHints } from "./sandboxHints.js";

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
const snippetBar = document.getElementById("snippetBar");
const snippetPicker = document.getElementById("snippetPicker");
const snippetHelp = document.getElementById("snippetHelp");
const hintsEl = document.getElementById("sandboxHints");

const textareas = {
  html: document.getElementById("editor-html"),
  css: document.getElementById("editor-css"),
  js: document.getElementById("editor-js")
};

const editors = { html: null, css: null, js: null };

let currentUser = null;
let currentSavedId = null;
let draftTimer = null;
let activeLang = "html";

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

/* ------------------------------------------------------------
   Snippet buttons: insert ready-made code at the cursor and
   highlight the part to change. Works with CodeMirror or the
   plain-textarea fallback.
   ------------------------------------------------------------ */

function renderSnippetBar(lang) {
  snippetBar.textContent = "";
  hideSnippetPicker();
  hideSnippetHelp();
  (SNIPPETS[lang] || []).forEach((snippet) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "snippet-btn";
    btn.textContent = snippet.label;
    btn.title = snippet.title;
    btn.addEventListener("click", () => handleSnippetClick(lang, snippet));
    snippetBar.appendChild(btn);
  });
}

function hideSnippetPicker() {
  snippetPicker.hidden = true;
  snippetPicker.textContent = "";
}

function hideSnippetHelp() {
  snippetHelp.hidden = true;
  snippetHelp.textContent = "";
}

function showSnippetHelp(text) {
  snippetHelp.textContent = text;
  snippetHelp.hidden = false;
}

/* What can a CSS or JavaScript snippet point at? Read the HTML tab:
   every id, plus every kind of element that's actually there. */
const IGNORED_TAGS = new Set(["html", "head", "body", "script", "style", "meta", "link", "title", "br"]);

function getTargetChoices({ noBody }) {
  const choices = [];
  const seen = new Set();
  const add = (selector, hint) => {
    if (seen.has(selector)) return;
    seen.add(selector);
    choices.push({ selector, hint });
  };

  try {
    const doc = new DOMParser().parseFromString(getCode("html"), "text/html");
    doc.body.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (IGNORED_TAGS.has(tag)) return;
      if (el.id) add("#" + el.id, `the <${tag}> with id “${el.id}”`);
      add(tag, `every <${tag}> on the page`);
    });
  } catch (err) {
    // An unreadable HTML tab just means fewer choices.
  }

  if (!noBody) add("body", "the whole page");
  return choices.slice(0, 12);
}

/* Fill in {target} and {value}, escaping text for quoted JavaScript. */
function escapeForJsString(text) {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\s*\n\s*/g, " ");
}

function resolveSnippet(snippet, target, rawValue) {
  const control = snippet.control;
  let value = rawValue;
  if (control) {
    if (value === undefined || value === "") value = String(control.value);
    if (control.type === "range") value = value + (control.unit || "");
    if (control.jsString) value = escapeForJsString(value);
  }
  const fill = (text) =>
    text.split("{target}").join(target || "").split("{value}").join(value === undefined ? "" : value);
  return { code: fill(snippet.code), select: fill(snippet.select), explain: fill(snippet.explain) };
}

function finishSnippet(lang, snippet, target, value, note) {
  hideSnippetPicker();
  const { code, select, explain } = resolveSnippet(snippet, target, value);
  insertSnippet(lang, code, select);
  showSnippetHelp(note ? explain + " " + note : explain);
}

function addPickerCancel(row) {
  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "snippet-chip snippet-chip-cancel";
  cancel.textContent = "Cancel";
  cancel.addEventListener("click", hideSnippetPicker);
  row.appendChild(cancel);
}

/* Step 2: let the user choose the value (a color, a size, some words). */
function showValueStep(lang, snippet, target, note) {
  const control = snippet.control;
  hideSnippetPicker();

  const label = document.createElement("p");
  label.className = "snippet-picker-label";
  label.textContent = control.label;
  snippetPicker.appendChild(label);

  const row = document.createElement("div");
  row.className = "snippet-picker-choices";

  let input;
  let readout = null;

  if (control.type === "choice") {
    input = document.createElement("select");
    control.options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option.replace(/'/g, "").split(",")[0];
      input.appendChild(opt);
    });
    input.value = control.value;
  } else {
    input = document.createElement("input");
    input.type = control.type === "color" ? "color" : control.type === "range" ? "range" : "text";
    if (control.type === "range") {
      input.min = control.min;
      input.max = control.max;
      input.step = control.step;
    }
    if (control.type === "text") input.maxLength = 60;
    input.value = control.value;
  }
  input.className = "snippet-control snippet-control-" + control.type;
  input.setAttribute("aria-label", control.label);
  row.appendChild(input);

  if (control.type === "range") {
    readout = document.createElement("span");
    readout.className = "snippet-readout";
    const update = () => { readout.textContent = input.value + (control.unit || ""); };
    input.addEventListener("input", update);
    update();
    row.appendChild(readout);
  }

  const add = document.createElement("button");
  add.type = "button";
  add.className = "snippet-chip snippet-chip-add";
  add.textContent = "Add";
  add.addEventListener("click", () => finishSnippet(lang, snippet, target, input.value, note));
  row.appendChild(add);

  if (control.type === "text") {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        add.click();
      }
    });
  }

  addPickerCancel(row);
  snippetPicker.appendChild(row);
  snippetPicker.hidden = false;
  input.focus();
}

function handleSnippetClick(lang, snippet) {
  hideSnippetPicker();
  hideSnippetHelp();

  // No target to choose: go straight to the value, or just insert.
  if (!snippet.target) {
    if (snippet.control) showValueStep(lang, snippet, "");
    else finishSnippet(lang, snippet, "");
    return;
  }

  const choices = getTargetChoices(snippet);

  // Nothing in the HTML to point at yet: use the default, and say so.
  if (choices.length === 0) {
    const note = "Your HTML tab doesn't have this yet. Add it there so this has something to change.";
    if (snippet.control) showValueStep(lang, snippet, snippet.target, note);
    else finishSnippet(lang, snippet, snippet.target, undefined, note);
    return;
  }

  const label = document.createElement("p");
  label.className = "snippet-picker-label";
  label.textContent = "Which part of your page?";
  snippetPicker.appendChild(label);

  const row = document.createElement("div");
  row.className = "snippet-picker-choices";
  choices.forEach(({ selector, hint }) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "snippet-chip";
    chip.textContent = selector;
    chip.title = hint;
    chip.addEventListener("click", () => {
      if (snippet.control) showValueStep(lang, snippet, selector);
      else finishSnippet(lang, snippet, selector);
    });
    row.appendChild(chip);
  });
  addPickerCancel(row);

  snippetPicker.appendChild(row);
  snippetPicker.hidden = false;
}

function insertSnippet(lang, code, select) {
  const offset = Math.max(0, code.indexOf(select));
  const selectLen = select.length;
  const cm = editors[lang];

  if (cm) {
    const cursor = cm.getCursor();
    const lineText = cm.getLine(cursor.line);
    // Start on a fresh line so snippets never land mid-sentence.
    let from = cursor;
    let prefix = "";
    if (lineText.trim() !== "") {
      from = { line: cursor.line, ch: lineText.length };
      prefix = "\n";
    }
    cm.replaceRange(prefix + code, from);

    // Work out where the placeholder landed (it may be on a later line).
    const before = prefix + code.slice(0, offset);
    const lines = before.split("\n");
    const startLine = from.line + lines.length - 1;
    const startCh = lines.length === 1 ? from.ch + lines[0].length : lines[lines.length - 1].length;
    cm.focus();
    cm.setSelection(
      { line: startLine, ch: startCh },
      { line: startLine, ch: startCh + selectLen }
    );
  } else {
    const ta = textareas[lang];
    const pos = ta.selectionStart ?? ta.value.length;
    const lineStart = ta.value.lastIndexOf("\n", pos - 1) + 1;
    let lineEnd = ta.value.indexOf("\n", pos);
    if (lineEnd === -1) lineEnd = ta.value.length;
    const needsBreak = ta.value.slice(lineStart, lineEnd).trim() !== "";
    const insertAt = needsBreak ? lineEnd : pos;
    const text = (needsBreak ? "\n" : "") + code;
    ta.value = ta.value.slice(0, insertAt) + text + ta.value.slice(insertAt);
    const start = insertAt + (needsBreak ? 1 : 0) + offset;
    ta.focus();
    ta.setSelectionRange(start, start + selectLen);
    ta.dispatchEvent(new Event("input"));
  }

  scheduleDraftSave();
}

function switchTab(lang) {
  activeLang = lang;
  renderSnippetBar(lang);
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

function renderHints() {
  const hints = checkSandboxHints({
    html: getCode("html"),
    css: getCode("css"),
    js: getCode("js")
  });

  hintsEl.textContent = "";
  hintsEl.hidden = hints.length === 0;
  hints.forEach((message) => {
    const p = document.createElement("p");
    p.textContent = message;
    hintsEl.appendChild(p);
  });
}

function runPreview() {
  hideError();
  renderHints();
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
    redirectLoggedOut();
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
  renderSnippetBar(activeLang);

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
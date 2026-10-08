import { supabase } from "./supabaseClient.js";
import { getCurrentUser } from "./auth.js";
import { initAuthStatus } from "./authStatus.js";
import { initMainNav } from "./mainNav.js";
import { registerServiceWorker } from "./registerServiceWorker.js";
import { moods } from "./moods.js";

initAuthStatus();
initMainNav();
registerServiceWorker();

/* ============================================================
   MY BUILDS
   Everything a person has finished, kept in one place.

   Free:  the 3 newest builds can be opened. Older ones stay
          saved (nothing is ever deleted automatically) but are
          locked until they upgrade.
   Plus:  every build opens, and each can be downloaded as a
          standalone HTML file.

   Note: the lock is applied here in the page, the same way the
   intermediate/advanced build gating already works. It's a
   product boundary, not a security boundary — these are the
   person's own builds either way.
   ============================================================ */

const FREE_UNLOCKED_COUNT = 3;

const listEl = document.getElementById("savedBuildsList");
const noteEl = document.getElementById("savedBuildsNote");
const errorEl = document.getElementById("savedBuildsError");

let isPlus = false;

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "my-build";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* Same document shape the build page uses for its live preview,
   including the long-word wrapping safety net. */
function renderDoc(build) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body { overflow-x: hidden; }
          body { overflow-wrap: break-word; word-break: break-word; }
        </style>
        <style>${build.css}</style>
      </head>
      <body>
        ${build.html}
        <script>${build.js}<\/script>
      </body>
    </html>
  `;
}

/* A clean, standalone file someone can open anywhere or host
   themselves — no dependency on this app. */
function buildStandaloneHtml(build) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(build.title)}</title>
<style>
${build.css}
</style>
</head>
<body>
${build.html}
<script>
${build.js}
<\/script>
</body>
</html>
`;
}

function downloadBuild(build) {
  const blob = new Blob([buildStandaloneHtml(build)], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(build.title)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------
   Card rendering. Titles and labels are set with textContent
   (never innerHTML) because Sandbox titles are typed by the user.
   ------------------------------------------------------------ */

function makeButton(label, className, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `btn secondary-btn saved-build-btn ${className || ""}`.trim();
  btn.textContent = label;
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}

function makeUpgradeLink(label) {
  const link = document.createElement("a");
  link.href = "account.html";
  link.className = "btn secondary-btn saved-build-btn";
  link.textContent = label;
  return link;
}

function renderCard(build, locked) {
  const card = document.createElement("article");
  card.className = "saved-build-card" + (locked ? " saved-build-locked" : "");

  const header = document.createElement("div");
  header.className = "saved-build-header";

  const titleWrap = document.createElement("div");
  titleWrap.className = "saved-build-titlewrap";

  const moodLabel =
    build.source === "sandbox"
      ? "Sandbox"
      : (moods[build.mood_key]?.label || "Build");

  const moodEl = document.createElement("span");
  moodEl.className = "journal-mood";
  moodEl.textContent = moodLabel;

  const titleEl = document.createElement("h3");
  titleEl.textContent = build.title;

  titleWrap.append(moodEl, titleEl);

  const dateEl = document.createElement("time");
  dateEl.dateTime = build.created_at;
  dateEl.textContent = formatDate(build.created_at);

  header.append(titleWrap, dateEl);
  card.appendChild(header);

  const actions = document.createElement("div");
  actions.className = "saved-build-actions";

  const previewSlot = document.createElement("div");
  previewSlot.className = "saved-build-preview";
  previewSlot.hidden = true;

  if (locked) {
    const msg = document.createElement("p");
    msg.className = "saved-build-lock-note";
    msg.textContent = "Saved and waiting for you. Unlock all your builds with Plus.";
    card.appendChild(msg);
    actions.appendChild(makeUpgradeLink("Unlock with Plus"));
  } else {
    /* Previews are created only when opened, and removed when
       closed — a long list of live iframes (each running its own
       timers and scripts) would be heavy and noisy. */
    const openBtn = makeButton("Open", "", () => {
      const isOpen = !previewSlot.hidden;

      if (isOpen) {
        previewSlot.replaceChildren();
        previewSlot.hidden = true;
        openBtn.textContent = "Open";
        return;
      }

      const frame = document.createElement("iframe");
      frame.className = "saved-build-frame";
      frame.title = `Preview of ${build.title}`;

      /* Sandbox creations can contain anything the person typed,
         so they run in a locked-down frame that can't touch this
         page's storage or session. Guided builds are our own
         curated code (only text is edited), and some of them rely
         on localStorage, so they keep normal behavior. */
      if (build.source === "sandbox") {
        frame.setAttribute("sandbox", "allow-scripts");
      }

      frame.srcdoc = renderDoc(build);
      previewSlot.replaceChildren(frame);
      previewSlot.hidden = false;
      openBtn.textContent = "Close";
    });

    actions.appendChild(openBtn);

    if (isPlus) {
      actions.appendChild(makeButton("Download", "", () => downloadBuild(build)));
    } else {
      actions.appendChild(makeUpgradeLink("Download (Plus)"));
    }
  }

  const deleteBtn = makeButton("Delete", "saved-build-delete", async () => {
    const confirmed = window.confirm("Delete this build? This can't be undone.");
    if (!confirmed) return;

    errorEl.hidden = true;
    const { error } = await supabase
      .from("saved_builds")
      .delete()
      .eq("id", build.id);

    if (error) {
      console.error("Error deleting saved build:", error);
      showError("We couldn't delete that build. Check your connection and try again.");
      return;
    }

    await loadBuilds();
  });
  actions.appendChild(deleteBtn);

  card.append(actions, previewSlot);
  return card;
}

/* ------------------------------------------------------------
   Loading
   ------------------------------------------------------------ */

async function loadBuilds() {
  const { data, error } = await supabase
    .from("saved_builds")
    .select("id, build_id, mood_key, title, html, css, js, source, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading saved builds:", error);
    listEl.replaceChildren();
    showError("We couldn't load your builds right now. Refresh the page to try again.");
    return;
  }

  listEl.replaceChildren();

  if (!data || data.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-journal";
    empty.innerHTML = `
      <h3>Nothing here yet.</h3>
      <p>Finish a guided build and it will be kept here for you.</p>
      <a href="mood.html" class="btn primary-btn">Start a build</a>
    `;
    listEl.appendChild(empty);
    noteEl.textContent = "";
    return;
  }

  const lockedCount = isPlus ? 0 : Math.max(0, data.length - FREE_UNLOCKED_COUNT);

  if (isPlus) {
    noteEl.textContent = `${data.length} build${data.length === 1 ? "" : "s"} saved`;
  } else if (lockedCount > 0) {
    noteEl.textContent =
      `Your ${FREE_UNLOCKED_COUNT} newest builds are open. ` +
      `${lockedCount} older build${lockedCount === 1 ? " is" : "s are"} saved and unlock with Plus.`;
  } else {
    noteEl.textContent = `${data.length} build${data.length === 1 ? "" : "s"} saved`;
  }

  data.forEach((build, index) => {
    const locked = !isPlus && index >= FREE_UNLOCKED_COUNT;
    listEl.appendChild(renderCard(build, locked));
  });
}

async function init() {
  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("user_id", user.id)
    .maybeSingle();

  isPlus = profile?.plan === "plus";

  await loadBuilds();
}

init();
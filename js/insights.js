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
   INSIGHTS (Plus)
   Everything here is computed in the browser from reflections the
   person has already saved: how they felt before and after each
   build (1–5), which mood and build it was, and when.

   "Lift" = mood_after − mood_before, so it ranges from −4 to +4.

   Design choices, since this is a mental-health-adjacent app:
   - Charts are plain HTML/CSS bars, not a charting library, so
     nothing here can fail to load the way a CDN script can.
   - It highlights what tends to HELP. It never ranks someone's
     "worst" anything, and a flat or negative average is described
     neutrally rather than as a failure.
   - Small samples are labeled as early data, and the whole page
     carries a note that it isn't a diagnosis.
   ============================================================ */

const MIN_REFLECTIONS = 3; // below this, show a gentle "not yet" state
const MIN_GROUP = 2;       // below this, a group is labeled early data
const MAX_LIFT = 4;        // largest possible shift on a 1–5 scale

const errorEl = document.getElementById("insightsError");
const lockedEl = document.getElementById("insightsLocked");
const emptyEl = document.getElementById("insightsEmpty");
const emptyTextEl = document.getElementById("insightsEmptyText");
const contentEl = document.getElementById("insightsContent");

/* ------------------------------------------------------------
   Small helpers
   ------------------------------------------------------------ */

function fmtLift(value) {
  const rounded = Math.round(value * 10) / 10;
  return (rounded > 0 ? "+" : "") + rounded.toFixed(1);
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function groupBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (key === null || key === undefined) continue;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

function stats(items) {
  const n = items.length;
  const total = items.reduce((sum, r) => sum + (r.mood_after - r.mood_before), 0);
  return { n, avg: n ? total / n : 0 };
}

function timeBucket(date) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Morning";
  if (hour >= 12 && hour < 17) return "Afternoon";
  if (hour >= 17 && hour < 21) return "Evening";
  return "Night";
}

const TIME_ORDER = ["Morning", "Afternoon", "Evening", "Night"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Monday first

/* ------------------------------------------------------------
   Rendering. All text goes in with textContent, since build names
   come from what the person typed.
   ------------------------------------------------------------ */

function renderRows(container, rows) {
  container.replaceChildren();

  if (rows.length === 0) {
    const p = document.createElement("p");
    p.className = "insights-sub";
    p.textContent = "Nothing to show here yet.";
    container.appendChild(p);
    return;
  }

  rows.forEach(({ label, avg, n }) => {
    const row = document.createElement("div");
    row.className = "insight-row";

    const labelEl = document.createElement("span");
    labelEl.className = "insight-label";
    labelEl.textContent = label;

    // Decorative: the same information is in the text value beside it
    const track = document.createElement("div");
    track.className = "insight-track";
    track.setAttribute("aria-hidden", "true");

    const fill = document.createElement("div");
    const pct = Math.min(Math.abs(avg) / MAX_LIFT, 1) * 50;
    fill.className = "insight-fill " + (avg >= 0 ? "pos" : "neg");
    fill.style.width = `${pct}%`;
    fill.style.left = avg >= 0 ? "50%" : `${50 - pct}%`;
    track.appendChild(fill);

    const valueEl = document.createElement("span");
    valueEl.className = "insight-value";
    valueEl.textContent =
      `${fmtLift(avg)} · ${plural(n, "build")}` + (n < MIN_GROUP ? " (early data)" : "");

    row.append(labelEl, track, valueEl);
    container.appendChild(row);
  });
}

function renderSummary(container, reflections, overall) {
  container.replaceChildren();

  const improved = reflections.filter((r) => r.mood_after > r.mood_before).length;
  const pctImproved = Math.round((improved / reflections.length) * 100);

  const cards = [
    { number: String(reflections.length), label: "Reflections" },
    { number: `${pctImproved}%`, label: "Felt better after building" },
    { number: fmtLift(overall.avg), label: "Average shift" }
  ];

  cards.forEach(({ number, label }) => {
    const card = document.createElement("div");
    card.className = "insight-card";

    const numEl = document.createElement("span");
    numEl.className = "insight-card-number";
    numEl.textContent = number;

    const labelEl = document.createElement("span");
    labelEl.className = "insight-card-label";
    labelEl.textContent = label;

    card.append(numEl, labelEl);
    container.appendChild(card);
  });

  return pctImproved;
}

function renderHighlights(list, lines) {
  list.replaceChildren();
  lines.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
}

/* ------------------------------------------------------------
   Analysis
   ------------------------------------------------------------ */

function analyze(reflections) {
  const overall = stats(reflections);

  // --- by mood (kept in the app's own mood order, not ranked) ---
  const moodGroups = groupBy(reflections, (r) =>
    moods[r.mood_key] ? r.mood_key : null
  );
  const moodRows = Object.keys(moods)
    .filter((key) => moodGroups.has(key))
    .map((key) => ({ label: moods[key].label, ...stats(moodGroups.get(key)) }));

  // --- by build (grouped by build id, falling back to the typed name) ---
  const buildGroups = groupBy(reflections, (r) => {
    if (r.build_id) return `id:${r.build_id}`;
    if (r.project) return `name:${r.project.trim().toLowerCase()}`;
    return null;
  });
  const buildRows = [...buildGroups.values()]
    .map((items) => {
      // Reflections arrive newest-first, so the first one has the
      // most recent name the person gave this build.
      const label = items[0].project || moods[items[0].mood_key]?.label || "Build";
      return { label, ...stats(items) };
    })
    .filter((row) => row.avg > 0)
    .sort((a, b) => b.avg - a.avg || b.n - a.n)
    .slice(0, 3);

  // --- by time of day ---
  const timeGroups = groupBy(reflections, (r) => timeBucket(new Date(r.created_at)));
  const timeRows = TIME_ORDER.filter((t) => timeGroups.has(t)).map((t) => ({
    label: t,
    ...stats(timeGroups.get(t))
  }));

  // --- by day of week ---
  const dayGroups = groupBy(reflections, (r) => new Date(r.created_at).getDay());
  const dayRows = DAY_ORDER.filter((d) => dayGroups.has(d)).map((d) => ({
    label: DAY_NAMES[d],
    ...stats(dayGroups.get(d))
  }));

  return { overall, moodRows, buildRows, timeRows, dayRows };
}

function pickBest(rows) {
  const eligible = rows.filter((row) => row.n >= MIN_GROUP && row.avg > 0);
  if (eligible.length === 0) return null;
  return eligible.reduce((best, row) => (row.avg > best.avg ? row : best));
}

function buildHighlights(reflections, result, pctImproved) {
  const lines = [];

  if (result.overall.avg > 0) {
    lines.push(
      `Across ${plural(reflections.length, "reflection")}, you felt better after ${pctImproved}% of your builds.`
    );
  } else {
    lines.push(
      "Building hasn't shifted how you feel much yet. That's okay — patterns take a few check-ins to show up."
    );
  }

  const bestMood = pickBest(result.moodRows);
  if (bestMood) {
    lines.push(
      `Builds for “${bestMood.label}” have lifted you the most so far (${fmtLift(bestMood.avg)} on average).`
    );
  }

  const bestTime = pickBest(result.timeRows);
  if (bestTime) {
    lines.push(
      `Your biggest lift tends to come in the ${bestTime.label.toLowerCase()} (${fmtLift(bestTime.avg)} on average).`
    );
  }

  const bestDay = pickBest(result.dayRows);
  if (bestDay) {
    lines.push(`${bestDay.label}s have been your strongest day for feeling a lift.`);
  }

  return lines;
}

/* ------------------------------------------------------------
   Startup
   ------------------------------------------------------------ */

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

  if (profile?.plan !== "plus") {
    lockedEl.classList.remove("hidden");
    return;
  }

  const { data, error } = await supabase
    .from("reflections")
    .select("mood_key, build_id, project, mood_before, mood_after, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading reflections for insights:", error);
    errorEl.textContent = "We couldn't load your insights right now. Refresh the page to try again.";
    errorEl.hidden = false;
    return;
  }

  // Older entries may be missing ratings; only complete pairs count.
  const reflections = (data || []).filter(
    (r) => typeof r.mood_before === "number" && typeof r.mood_after === "number"
  );

  if (reflections.length < MIN_REFLECTIONS) {
    const remaining = MIN_REFLECTIONS - reflections.length;
    emptyTextEl.textContent =
      `Insights need at least ${MIN_REFLECTIONS} reflections with mood ratings to say anything ` +
      `meaningful. You're ${plural(remaining, "reflection")} away.`;
    emptyEl.classList.remove("hidden");
    return;
  }

  const result = analyze(reflections);

  const pctImproved = renderSummary(
    document.getElementById("insightsSummary"),
    reflections,
    result.overall
  );

  renderHighlights(
    document.getElementById("insightsHighlights"),
    buildHighlights(reflections, result, pctImproved)
  );

  renderRows(document.getElementById("insightsByMood"), result.moodRows);
  renderRows(document.getElementById("insightsTopBuilds"), result.buildRows);
  renderRows(document.getElementById("insightsByTime"), result.timeRows);
  renderRows(document.getElementById("insightsByDay"), result.dayRows);

  contentEl.classList.remove("hidden");
}

init();
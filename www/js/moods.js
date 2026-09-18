/* ============================================================
   MOOD REGISTRY
   Each mood just describes itself + which build IDs belong to it.
   Actual build content lives in builds.js. To add a new mood:
     1. Add an entry here
     2. Add at least one build in builds.js with matching `mood` key
     3. Add a mood-card button in mood.html calling selectMood('yourKey')
   ============================================================ */

   import { supabase } from "./supabaseClient.js";

   export const moods = {
     anxious: {
       label: "Anxious",
       icon: "〰",
       iconColor: "blue",
       tagline: "Build something calming and rhythmic.",
       builds: ["breathing-timer", "calm-color-mixer", "grounding-check-in", "worry-postponement-box", "anchor-shape-morph", "steady-hands-trace", "anxiety-thermometer-log", "safe-place-builder", "box-breathing-counter", "whatif-flip-cards", "live-worry-scale", "calm-routine-builder", "hold-to-release"]
     },
     overthinking: {
       label: "Overthinking",
       icon: "🧠",
       iconColor: "purple",
       tagline: "Organize your thoughts into something visual.",
       builds: ["thought-sorter", "worry-jar", "decision-weigher", "loop-breaker", "base-rate-check", "elimination-bracket", "confidence-decay-meter", "situation-lens-shuffler", "mental-tabs-closer", "certainty-contract", "keyboard-shortcut-categorizer", "spiral-zoom-out", "time-cost-accumulator"]
     },
     unmotivated: {
       label: "Unmotivated",
       icon: "🌱",
       iconColor: "green",
       tagline: "Start small with a tiny wins tracker.",
       builds: ["wins-tracker", "momentum-checklist", "two-minute-starter", "habit-streak-tracker", "task-breakdown-chunker", "momentum-ball", "excuse-buster", "five-second-launch", "task-roulette-wheel", "minimum-effort-contract", "domino-chain", "tiny-task-dice", "accountability-ping", "energy-battery-meter"]
     },
     sad: {
       label: "Sad",
       icon: "☁",
       iconColor: "blue",
       tagline: "Create something gentle and encouraging.",
       builds: ["affirmation-generator", "gratitude-snapshot", "memory-lane", "self-compassion-rewriter", "comfort-memory-match", "emotion-weather-report", "locked-comfort-checklist", "tears-counter", "warm-light-dimmer", "story-pages", "cumulative-hug-timer", "comfort-object-builder", "wave-of-grief"]
     },
     angry: {
       label: "Angry",
       icon: "🔥",
       iconColor: "orange",
       tagline: "Channel some energy into a focused build.",
       builds: ["energy-release-timer", "pressure-release-valve", "smash-board", "punch-counter", "shred-it", "volume-knob", "rage-journal", "durability-wall", "snapback-slider", "scream-meter", "combo-clicker", "anger-weather-vane", "cooldown-grid"]
     },
     lonely: {
       label: "Lonely",
       icon: "🌙",
       iconColor: "teal",
       tagline: "Create something that keeps you a little company.",
       builds: ["message-in-a-bottle", "constellation-builder", "companion-note-wall", "branching-dialogue-companion", "shared-silence-timer", "window-lights", "companion-footsteps", "echo-chamber", "companion-plant", "orbit-companion", "someones-awake-map", "companion-breathing-sync", "compliment-ping-pong"]
     }
   };
   
   /* ------------------------------------------------------------
      Picks a build for a mood, avoiding the last build the user
      got for that same mood (when more than one option exists).
      GUEST version — stored per-browser in localStorage.
      ------------------------------------------------------------ */
   export function pickBuildForMood(moodKey) {
     const mood = moods[moodKey];
     if (!mood || !mood.builds.length) return null;
   
     const history = JSON.parse(localStorage.getItem("buildHistory") || "{}");
     const lastBuildId = history[moodKey];
   
     let choices = mood.builds;
     if (choices.length > 1 && lastBuildId) {
       choices = choices.filter(id => id !== lastBuildId);
     }
   
     const buildId = choices[Math.floor(Math.random() * choices.length)];
   
     history[moodKey] = buildId;
     localStorage.setItem("buildHistory", JSON.stringify(history));
   
     return buildId;
   }
   
   /* ------------------------------------------------------------
      Same idea, but for a logged-in user — stored server-side in
      the mood_selections table, so the no-repeat behavior follows
      them across devices instead of resetting per-browser.
      ------------------------------------------------------------ */
   export async function pickBuildForMoodAccount(moodKey, userId) {
     const mood = moods[moodKey];
     if (!mood || !mood.builds.length) return null;
   
     const { data, error } = await supabase
       .from("mood_selections")
       .select("last_build_id")
       .eq("user_id", userId)
       .eq("mood_key", moodKey)
       .maybeSingle();
   
     if (error) {
       console.error("Failed to load mood selection history:", error.message);
     }
   
     const lastBuildId = data ? data.last_build_id : null;
   
     let choices = mood.builds;
     if (choices.length > 1 && lastBuildId) {
       choices = choices.filter(id => id !== lastBuildId);
     }
   
     const buildId = choices[Math.floor(Math.random() * choices.length)];
   
     const { error: upsertError } = await supabase
       .from("mood_selections")
       .upsert(
         {
           user_id: userId,
           mood_key: moodKey,
           last_build_id: buildId,
           updated_at: new Date().toISOString()
         },
         { onConflict: "user_id,mood_key" }
       );
   
     if (upsertError) {
       console.error("Failed to save mood selection history:", upsertError.message);
     }
   
     return buildId;
   }
/* ============================================================
   FUN FACTS
   Rotates a short, engaging fact into any element while the
   user fills out onboarding. Currently general facts about
   coding, journaling, and mood — not live app statistics,
   since a brand-new app doesn't have numbers worth bragging
   about yet.

   To upgrade this later to real stats (total builds completed,
   average mood improvement, etc.), replace the FACTS array
   with an async function that queries an aggregate view/RPC
   in Supabase, and adjust startFunFactRotation to await it.
   Nothing else about how this is called needs to change.
   ============================================================ */

   const FACTS = [
    "Journaling for even a few minutes a day has been linked to lower stress levels.",
    "Learning to code lights up the same problem-solving parts of your brain as solving a puzzle.",
    "Tracking your mood over time is one of the simplest ways therapists help people notice patterns.",
    "Finishing a small task — even a tiny one — gives your brain a real sense of reward.",
    "Ada Lovelace wrote the first published computer program in 1843, before computers could even run it.",
    "Most people who build a 3-day streak are far more likely to keep a habit going long-term.",
    "Writing down how you feel, even briefly, can make big emotions feel more manageable.",
    "Small, consistent steps tend to build more lasting change than big, occasional bursts of effort."
  ];
  
  let rotationInterval = null;
  
  /* ------------------------------------------------------------
     Starts rotating facts into the element with the given id,
     changing every `intervalMs` milliseconds. Returns a stop
     function so the caller can clean up if needed.
     ------------------------------------------------------------ */
  export function startFunFactRotation(elementId, intervalMs = 6000) {
    const el = document.getElementById(elementId);
    if (!el) return () => {};
  
    let index = Math.floor(Math.random() * FACTS.length);
    el.textContent = FACTS[index];
  
    clearInterval(rotationInterval);
    rotationInterval = setInterval(() => {
      index = (index + 1) % FACTS.length;
      el.textContent = FACTS[index];
    }, intervalMs);
  
    return () => clearInterval(rotationInterval);
  }
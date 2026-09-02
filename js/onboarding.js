import { supabase } from "./supabaseClient.js";

/* ------------------------------------------------------------
   Checks whether this user has finished onboarding.
   Fails "open" (treats as completed) on error so a Supabase
   hiccup never traps someone in a redirect loop.
   ------------------------------------------------------------ */
export async function hasCompletedOnboarding(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking onboarding status:", error);
    return true;
  }

  return Boolean(data?.onboarding_completed);
}

/* ------------------------------------------------------------
   Called right after a successful sign-in or sign-up.
   Sends new/incomplete users into onboarding, everyone else
   straight to the app.
   ------------------------------------------------------------ */
export async function redirectAfterAuth(user) {
  if (!user) return;
  const completed = await hasCompletedOnboarding(user.id);
  window.location.href = completed ? "mood.html" : "onboarding-welcome.html";
}

/* ------------------------------------------------------------
   Turns questionnaire answers into a "Build Profile" +
   starting path tags. Simple rule-based scoring — no ML needed
   for four questions.
   ------------------------------------------------------------ */
export function computeProfile({ motivation, buildInterest, codingComfort, goals }) {
  let profileName = "Steady Starter";
  let blurb = "You're just getting oriented, and that's a great place to start.";

  if (motivation === "creativity" || buildInterest === "creative") {
    profileName = "Creative Explorer";
    blurb = "You're interested in exploring ideas and using creativity to move forward.";
  } else if (motivation === "unstuck" || goals.includes("calm")) {
    profileName = "Calm Builder";
    blurb = "You're looking for a steady, low-pressure way to work through what's on your mind.";
  } else if (motivation === "confidence") {
    profileName = "Confidence Builder";
    blurb = "You're here to prove to yourself that you can do this, one small build at a time.";
  } else if (motivation === "skills" || codingComfort === "intermediate" || codingComfort === "experienced") {
    profileName = "Skill Sharpener";
    blurb = "You want to actually get better at building things, not just dabble.";
  }

  const tags = [];
  if (codingComfort === "beginner" || codingComfort === "dabbled") {
    tags.push("Beginner-friendly builds", "Short 15–30 minute builds");
  } else {
    tags.push("Intermediate builds", "Stretch projects");
  }
  if (buildInterest === "creative" || motivation === "creativity") {
    tags.push("Creativity-focused projects");
  }
  if (goals.includes("calm")) {
    tags.push("Low-pressure pacing");
  }

  return { profileName, blurb, tags };
}
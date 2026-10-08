import { supabase } from "./supabaseClient.js";

/* ============================================================
   THEMES
   Light + teal is the default and is free. Dark mode and the
   extra accent colors are Plus.

   To change what's free, edit PLUS_ONLY_MODES / PLUS_ONLY_ACCENTS
   below — nothing else needs to change. (Dark mode is also an
   accessibility feature for some people; if you decide it should
   be free, empty PLUS_ONLY_MODES.)

   How the pieces fit:
   - themeInit.js applies the saved theme before first paint.
   - This file applies/saves themes and enforces the Plus gate.
   - The choice is stored in localStorage (instant, per device)
     and in profiles.preferences.theme (so it follows the person
     to a new device after they log in).

   Nothing here is a security boundary — it's cosmetic. A free
   account that hand-edits localStorage would just see a color
   scheme; the next page load re-checks their plan and resets it.
   ============================================================ */

export const DEFAULT_THEME = { mode: "light", accent: "teal" };
export const ACCENTS = ["teal", "lavender", "rose", "sunrise"];

const PLUS_ONLY_MODES = ["dark"];
const PLUS_ONLY_ACCENTS = ["lavender", "rose", "sunrise"];

const STORAGE_KEY = "byo-theme";

export function normalizeTheme(theme) {
  return {
    mode: theme && theme.mode === "dark" ? "dark" : "light",
    accent: theme && ACCENTS.includes(theme.accent) ? theme.accent : "teal"
  };
}

export function themeNeedsPlus(theme) {
  const t = normalizeTheme(theme);
  return PLUS_ONLY_MODES.includes(t.mode) || PLUS_ONLY_ACCENTS.includes(t.accent);
}

export function modeNeedsPlus(mode) {
  return PLUS_ONLY_MODES.includes(mode);
}

export function accentNeedsPlus(accent) {
  return PLUS_ONLY_ACCENTS.includes(accent);
}

export function getStoredTheme() {
  try {
    return normalizeTheme(JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"));
  } catch (err) {
    return { ...DEFAULT_THEME };
  }
}

export function storeTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeTheme(theme)));
  } catch (err) {
    // Storage can be unavailable — the theme just won't persist on this device.
  }
}

export function applyTheme(theme) {
  const t = normalizeTheme(theme);
  const root = document.documentElement;

  if (t.mode === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  if (t.accent !== "teal") {
    root.setAttribute("data-accent", t.accent);
  } else {
    root.removeAttribute("data-accent");
  }
}

async function fetchProfileTheme(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("plan, preferences")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error loading theme settings:", error);
    return null;
  }

  return data;
}

/* Saves the chosen theme on this device and on the account. The
   preferences column holds other settings too (reminders, notes),
   so this merges into whatever is already there rather than
   replacing it. */
export async function persistTheme(userId, theme) {
  const clean = normalizeTheme(theme);
  storeTheme(clean);

  const profile = await fetchProfileTheme(userId);
  const prefs = { ...((profile && profile.preferences) || {}), theme: clean };

  const { error } = await supabase
    .from("profiles")
    .update({ preferences: prefs })
    .eq("user_id", userId);

  if (error) {
    console.error("Error saving theme:", error);
    return false;
  }

  return true;
}

/* Runs on every page for logged-in people. It only does any
   network work if a non-default theme is stored, so people on the
   default theme pay nothing. If the account is no longer Plus
   (e.g. their subscription ended), the theme quietly resets. */
export async function validateThemeForPlan(userId) {
  const stored = getStoredTheme();
  if (!themeNeedsPlus(stored)) return;

  const profile = await fetchProfileTheme(userId);
  if (!profile) return; // couldn't check — leave things alone rather than flicker

  if (profile.plan !== "plus") {
    storeTheme(DEFAULT_THEME);
    applyTheme(DEFAULT_THEME);
  }
}

/* Called after login, so a theme chosen on one device shows up on
   another. Plus accounts get their saved theme; everyone else gets
   the default. */
export async function syncThemeFromProfile(userId) {
  try {
    const profile = await fetchProfileTheme(userId);
    if (!profile) return;

    if (profile.plan === "plus" && profile.preferences && profile.preferences.theme) {
      const theme = normalizeTheme(profile.preferences.theme);
      storeTheme(theme);
      applyTheme(theme);
    } else if (profile.plan !== "plus") {
      storeTheme(DEFAULT_THEME);
      applyTheme(DEFAULT_THEME);
    }
  } catch (err) {
    console.error("Error syncing theme:", err);
  }
}
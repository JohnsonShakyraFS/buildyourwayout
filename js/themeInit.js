/* ============================================================
   themeInit.js — loaded as a plain (non-module) <script> in the
   <head> of every page, so it runs BEFORE the page is painted.

   If this lived in a module it would run after first paint and
   dark-mode users would see a flash of the light theme on every
   page load. It only reads a value from localStorage and sets two
   attributes on <html>; the real logic (plan checks, saving, the
   picker) lives in theme.js.
   ============================================================ */
   (function () {
    try {
      var saved = JSON.parse(localStorage.getItem("byo-theme") || "null");
      if (!saved) return;
  
      var root = document.documentElement;
  
      if (saved.mode === "dark") {
        root.setAttribute("data-theme", "dark");
      }
  
      if (saved.accent === "lavender" || saved.accent === "rose" || saved.accent === "sunrise") {
        root.setAttribute("data-accent", saved.accent);
      }
    } catch (err) {
      // Storage unavailable or malformed — fall back to the default theme.
    }
  })();
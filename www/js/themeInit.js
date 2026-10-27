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
    // Mark the native app (and which platform) before first paint, so
    // purchase buttons never flash and iOS-only styles apply at once.
    try {
      var cap = window.Capacitor;
      if (cap && cap.isNativePlatform && cap.isNativePlatform()) {
        var cls = document.documentElement.classList;
        cls.add("is-native");
        cls.add("is-" + (cap.getPlatform ? cap.getPlatform() : "native"));
  
        // Stop iOS from zooming the page when a field or the code editor is
        // tapped. Only in the apps; the website keeps normal pinch-to-zoom.
        var vp = document.querySelector('meta[name="viewport"]');
        if (vp) {
          var content = (vp.getAttribute("content") || "")
            .replace(/,?\s*(maximum-scale|minimum-scale|user-scalable)\s*=\s*[^,]*/g, "");
          vp.setAttribute("content", content + ", maximum-scale=1, user-scalable=no");
        }
      }
    } catch (err) {
      // No Capacitor: this is the website.
    }
  })();
  
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
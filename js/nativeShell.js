/* ============================================================
   Native shell touches (phone apps only)
   Keeps the phone's status bar text readable: light text on a
   dark theme, dark text on a light one. Does nothing on the
   website, and nothing if the status-bar plugin isn't installed.
   ============================================================ */

   export function syncStatusBar() {
    const cap = window.Capacitor;
    const bar = cap?.Plugins?.StatusBar;
    if (!cap?.isNativePlatform?.() || !bar) return;
  
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    try {
      // "DARK" means light text for dark backgrounds, and "LIGHT" the reverse.
      Promise.resolve(bar.setStyle({ style: dark ? "DARK" : "LIGHT" })).catch(() => {});
    } catch (err) {
      // Not available on this device; the default bar is fine.
    }
  }
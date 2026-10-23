/* ============================================================
   Service worker registration (offline support on the website)

   - Website: registers /sw.js once the page has loaded.
   - Phone apps: the app's files are already stored on the phone, so
     a service worker adds nothing and can serve stale copies after
     an app update. Instead, any worker or cache left over from an
     earlier version is removed.
   - Browsers and app views without service worker support (such as
     the iOS app view) are skipped quietly.
   ============================================================ */

   async function removeLeftoverWorkers() {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
      if (window.caches?.keys) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }
    } catch (err) {
      console.warn("Could not clear old service workers:", err);
    }
  }
  
  function register() {
    try {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
    } catch (err) {
      console.warn("Service worker registration failed:", err);
    }
  }
  
  export function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
  
    if (window.Capacitor?.isNativePlatform?.()) {
      removeLeftoverWorkers();
      return;
    }
  
    // The page may already be loaded by the time this module runs.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }
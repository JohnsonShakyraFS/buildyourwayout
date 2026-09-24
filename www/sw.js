const CACHE_NAME = "build-your-way-out-v2";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/mood.html",
  "/project.html",
  "/projectLibrary.html",
  "/reflection.html",
  "/journal.html",
  "/login.html",
  "/account.html",
  "/pricing.html",
  "/forgot-password.html",
  "/reset-password.html",
  "/privacy.html",
  "/terms.html",
  "/onboarding-welcome.html",
  "/onboarding-questionnaire.html",
  "/onboarding-results.html",
  "/css/style.css",
  "/js/main.js",
  "/js/moods.js",
  "/js/builds.js",
  "/js/reflection.js",
  "/js/journal.js",
  "/js/auth.js",
  "/js/authStatus.js",
  "/js/mainNav.js",
  "/js/login.js",
  "/js/supabaseClient.js",
  "/js/forgotPassword.js",
  "/js/resetPassword.js",
  "/js/account.js",
  "/js/projectLibrary.js",
  "/js/onboarding.js",
  "/js/onboarding-welcome.js",
  "/js/onboarding-questionnaire.js",
  "/js/onboarding-results.js",
  "/js/funFacts.js",
  "/js/registerServiceWorker.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png"
];

/* ------------------------------------------------------------
   Precaches every asset individually instead of using
   cache.addAll(), which fails ALL-OR-NOTHING — if even one file
   in the list 404s or is temporarily unreachable, addAll()
   rejects the whole install, and the service worker never
   activates at all. That's exactly what was happening here
   before this list was updated (a single missing icon broke
   every future page's offline caching).

   Promise.allSettled means one bad entry just gets skipped and
   logged — everything else still gets cached, and install still
   succeeds.
   ------------------------------------------------------------ */
async function precacheResilient(cache, urls) {
  const results = await Promise.allSettled(
    urls.map((url) => cache.add(url))
  );

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.warn(`Service worker: failed to precache ${urls[i]}`, result.reason);
    }
  });
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => precacheResilient(cache, STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never touch Supabase API calls or CDN-loaded libraries --
  // auth, data, and third-party scripts must always hit the
  // network, never be served stale.
  if (
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("jsdelivr.net") ||
    url.hostname.includes("esm.sh") ||
    url.hostname.includes("cdnjs.cloudflare.com")
  ) {
    return;
  }

  // Only handle same-origin GET requests
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
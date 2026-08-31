const CACHE_NAME = "build-your-way-out-v1";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/mood.html",
  "/project.html",
  "/reflection.html",
  "/login.html",
  "/account.html",
  "/forgot-password.html",
  "/reset-password.html",
  "/project-library.html",
  "/privacy.html",
  "/terms.html",
  "/css/style.css",
  "/js/main.js",
  "/js/moods.js",
  "/js/builds.js",
  "/js/reflection.js",
  "/js/auth.js",
  "/js/authStatus.js",
  "/js/login.js",
  "/js/supabaseClient.js",
  "/js/forgotPassword.js",
  "/js/resetPassword.js",
  "/js/account.js",
  "/js/projectLibrary.js",
  "/js/registerServiceWorker.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
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

  // Never touch Supabase API calls or the CDN-loaded supabase-js library --
  // auth and data must always hit the network, never be served stale.
  if (
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("jsdelivr.net") ||
    url.hostname.includes("esm.sh")
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
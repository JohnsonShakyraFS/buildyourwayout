/* ============================================================
   Error monitoring (Sentry) for the website and the Android app.

   Importing this file is all a page needs. It does nothing until a
   Sentry DSN is pasted in below, and it can never break a page: if
   Sentry fails to load (blocked network, ad blocker), the app runs
   exactly as before.

   PRIVACY: this is a mental-health app, so the setup is deliberately
   strict. No session replay, no user identity, no cookies, no
   console logs or typed text in breadcrumbs, URLs stripped of query
   strings, and email addresses scrubbed from messages. Errors say
   WHAT broke and WHERE, never what someone wrote.
   ============================================================ */

// Paste your project's DSN here (Sentry → Project Settings → Client Keys).
// A DSN is designed to be public in browser code; it can only send errors in.
const SENTRY_DSN = "";

const SDK_URL = "https://browser.sentry-cdn.com/8.55.0/bundle.min.js";
const MAX_BUFFERED = 10;

const isNative = !!window.Capacitor?.isNativePlatform?.();
const host = window.location.hostname;
const enabled = Boolean(SENTRY_DSN) && (isNative || (host !== "localhost" && host !== "127.0.0.1"));

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

function scrubText(text) {
  return typeof text === "string" ? text.replace(EMAIL_RE, "[email]") : text;
}

function stripQuery(url) {
  if (typeof url !== "string") return url;
  return url.split("?")[0].split("#")[0];
}

const buffered = [];
let sentryReady = false;

function bufferError(err) {
  if (sentryReady || buffered.length >= MAX_BUFFERED) return;
  buffered.push(err);
}

if (enabled) {
  // Errors that happen while the SDK is still loading are held, then sent.
  const onError = (event) => bufferError(event.error || event.message);
  const onRejection = (event) => bufferError(event.reason);
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onRejection);

  const script = document.createElement("script");
  script.src = SDK_URL;
  script.crossOrigin = "anonymous";
  script.async = true;

  script.onload = () => {
    try {
      const Sentry = window.Sentry;
      Sentry.init({
        dsn: SENTRY_DSN,
        environment: isNative ? "android-app" : "website",
        sendDefaultPii: false,
        tracesSampleRate: 0,
        maxBreadcrumbs: 20,
        ignoreErrors: [
          "ResizeObserver loop limit exceeded",
          "ResizeObserver loop completed with undelivered notifications",
          "Non-Error promise rejection captured"
        ],
        beforeBreadcrumb(breadcrumb) {
          // Console output and typing can contain what someone wrote.
          if (["console", "ui.input", "ui.click"].includes(breadcrumb.category)) return null;
          if (breadcrumb.data?.url) breadcrumb.data.url = stripQuery(breadcrumb.data.url);
          return breadcrumb;
        },
        beforeSend(event) {
          delete event.user;
          if (event.request) {
            delete event.request.cookies;
            delete event.request.headers;
            delete event.request.query_string;
            event.request.url = stripQuery(event.request.url);
          }
          if (event.message) event.message = scrubText(event.message);
          event.exception?.values?.forEach((value) => {
            value.value = scrubText(value.value);
          });
          return event;
        }
      });

      Sentry.setTag("platform", isNative ? "android-app" : "web");
      sentryReady = true;

      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      // Sentry now handles new errors itself; send what was held.
      buffered.splice(0).forEach((err) => {
        Sentry.captureException(err instanceof Error ? err : new Error(String(err)));
      });
    } catch (err) {
      console.warn("Monitoring could not start:", err);
    }
  };

  script.onerror = () => {
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onRejection);
  };

  document.head.appendChild(script);
}

/* Optional: report an error you've already caught (in a try/catch) so
   it still reaches Sentry. Safe to call whether or not Sentry is on. */
export function reportError(err) {
  try {
    if (sentryReady) window.Sentry.captureException(err instanceof Error ? err : new Error(String(err)));
  } catch (_e) {
    // Monitoring must never cause a second problem.
  }
}
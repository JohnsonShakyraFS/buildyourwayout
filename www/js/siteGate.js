/* ============================================================
   Website access rules (the native app keeps its own flow)

   - Logged out: public pages only (home, login, pricing, legal,
     password reset). Any signed-in page sends you to the home page.
   - Logged in: the home page is hidden. Visiting it sends you to
     Mood Builds.

   Inside the Capacitor app none of this redirecting applies: the
   app has its own start screen, and a logged-out visitor there is
   sent to the login page as before.
   ============================================================ */

   export const PROTECTED_PAGES = [
    "mood",
    "project",
    "my-builds",
    "sandbox",
    "insights",
    "journal",
    "account",
    "reflection",
    "onboarding-welcome",
    "onboarding-questionnaire",
    "onboarding-results",
    "onboarding-walkthrough"
  ];
  
  export function isNativeApp() {
    return !!window.Capacitor?.isNativePlatform?.();
  }
  
  export function pageName(pathname = window.location.pathname) {
    const last = pathname.split("/").pop() || "index";
    return last.replace(/\.html$/, "") || "index";
  }
  
  /* Pure decision: where (if anywhere) should this visitor be sent? */
  export function gateDecision({ page, loggedIn, native }) {
    // The app never shows the pricing page (no purchases inside the app).
    if (native && page === "pricing") return loggedIn ? "mood.html" : "login.html";
    if (native) return null;
    if (loggedIn && page === "index") return "mood.html";
    if (!loggedIn && PROTECTED_PAGES.includes(page)) return "index.html";
    return null;
  }
  
  export function applySiteGate(user) {
    const target = gateDecision({
      page: pageName(),
      loggedIn: !!user,
      native: isNativeApp()
    });
    if (target) window.location.replace(target);
  }
  
  /* Used by each page's own "must be signed in" check. */
  export function redirectLoggedOut() {
    window.location.replace(isNativeApp() ? "login.html" : "index.html");
  }
  
  /* True inside the app. Purchases are hidden there (see style.css,
     html.is-native), and pages use this to word things neutrally. */
  export function inNativeApp() {
    return document.documentElement.classList.contains("is-native") || isNativeApp();
  }
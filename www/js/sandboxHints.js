/* ============================================================
   Sandbox "heads up" checks
   Looks for CSS and JavaScript that points at something the HTML
   doesn't contain, and returns gentle, plain-language notes. These
   are hints, never errors: code that builds elements at runtime
   can legitimately look for things that aren't in the HTML yet.
   ============================================================ */

   const MAX_HINTS = 4;

   function stripCssComments(css) {
     return css.replace(/\/\*[\s\S]*?\*\//g, "");
   }
   
   function cssSelectors(css) {
     const found = [];
     const re = /([^{}]+)\{/g;
     let match;
     while ((match = re.exec(stripCssComments(css))) !== null) {
       const block = match[1].trim();
       if (!block || block.startsWith("@")) continue;
       block.split(",").forEach((part) => {
         // Hover, focus and ::before only change HOW something looks,
         // so check the element they belong to.
         const selector = part.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, "").trim();
         if (!selector) return;
         if (/^(\d+(\.\d+)?%|from|to)$/i.test(selector)) return; // keyframe steps
         found.push(selector);
       });
     }
     return found;
   }
   
   function jsLookups(js) {
     const found = [];
     const withoutComments = js.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
   
     const queryRe = /querySelector(?:All)?\(\s*(["'`])((?:(?!\1).)*)\1\s*\)/g;
     let m;
     while ((m = queryRe.exec(withoutComments)) !== null) {
       found.push({ selector: m[2], kind: "selector" });
     }
   
     const idRe = /getElementById\(\s*(["'`])((?:(?!\1).)*)\1\s*\)/g;
     while ((m = idRe.exec(withoutComments)) !== null) {
       found.push({ selector: "#" + m[2], kind: "id" });
     }
     return found;
   }
   
   export function checkSandboxHints({ html, css, js }) {
     const hints = [];
     let doc;
     try {
       doc = new DOMParser().parseFromString(html || "", "text/html");
     } catch (err) {
       return hints;
     }
   
     const exists = (selector) => {
       try {
         return doc.querySelector(selector) !== null;
       } catch (err) {
         return true; // not a selector we understand, so stay quiet
       }
     };
   
     const seen = new Set();
     const add = (message) => {
       if (seen.has(message) || hints.length >= MAX_HINTS) return;
       seen.add(message);
       hints.push(message);
     };
   
     cssSelectors(css || "").forEach((selector) => {
       if (!exists(selector)) {
         add(`Your CSS styles “${selector}”, but nothing in your HTML matches it yet. Add it on the HTML tab to see the style.`);
       }
     });
   
     jsLookups(js || "").forEach(({ selector }) => {
       if (!exists(selector)) {
         add(`Your JavaScript looks for “${selector}”, but nothing in your HTML matches it. Add it on the HTML tab (you can ignore this if your code creates it).`);
       }
     });
   
     return hints;
   }
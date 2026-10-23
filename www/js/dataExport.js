/* ============================================================
   Export all my data (free for everyone)
   Collects everything stored under the signed-in account into one
   JSON file the person can keep. Each table is fetched separately,
   so one failing never blocks the rest, and anything that couldn't
   be included is named in the file and reported back to the page.

   Billing details are held by Stripe, so they're not part of this
   file, and the internal Stripe customer reference is left out.
   ============================================================ */

   import { supabase } from "./supabaseClient.js";

   const PAGE_SIZE = 1000;
   
   const SECTIONS = [
     { key: "profile", table: "profiles", single: true, omit: ["stripe_customer_id"] },
     { key: "reflections", table: "reflections", order: "created_at" },
     { key: "savedBuilds", table: "saved_builds", order: "created_at" },
     { key: "buildProgress", table: "build_progress" },
     { key: "moodSelections", table: "mood_selections" }
   ];
   
   async function fetchAllRows(table, userId, order) {
     const rows = [];
     for (let from = 0; ; from += PAGE_SIZE) {
       let query = supabase.from(table).select("*").eq("user_id", userId);
       if (order) query = query.order(order, { ascending: true });
       const { data, error } = await query.range(from, from + PAGE_SIZE - 1);
       if (error) throw error;
       rows.push(...(data || []));
       if (!data || data.length < PAGE_SIZE) break;
     }
     return rows;
   }
   
   function withoutKeys(row, omit = []) {
     if (!row) return row;
     const copy = { ...row };
     omit.forEach((key) => delete copy[key]);
     return copy;
   }
   
   export async function buildExport(user) {
     const result = {
       exportedAt: new Date().toISOString(),
       exportedFrom: "Build Your Way Out",
       account: {
         id: user.id,
         email: user.email,
         createdAt: user.created_at || null
       }
     };
     const unavailable = [];
   
     for (const section of SECTIONS) {
       try {
         const rows = await fetchAllRows(section.table, user.id, section.order);
         result[section.key] = section.single
           ? withoutKeys(rows[0] || null, section.omit)
           : rows.map((row) => withoutKeys(row, section.omit));
       } catch (err) {
         console.error(`Export: could not read ${section.table}:`, err);
         result[section.key] = null;
         unavailable.push(section.key);
       }
     }
   
     if (unavailable.length) result.notIncluded = unavailable;
     return { data: result, unavailable };
   }
   
   /* Saves a text file. On phones, the share sheet is the dependable
      way to hand a file over; on desktop browsers it's a normal download. */
   async function saveFile(filename, text, mime) {
     const blob = new Blob([text], { type: mime });
   
     if (window.Capacitor?.isNativePlatform?.() && navigator.canShare && navigator.share) {
       const file = new File([blob], filename, { type: mime });
       if (navigator.canShare({ files: [file] })) {
         try {
           await navigator.share({ files: [file], title: filename });
           return;
         } catch (err) {
           if (err?.name === "AbortError") return; // they closed the share sheet
           // Anything else: fall back to a plain download below.
         }
       }
     }
   
     const url = URL.createObjectURL(blob);
     const link = document.createElement("a");
     link.href = url;
     link.download = filename;
     document.body.appendChild(link);
     link.click();
     link.remove();
     setTimeout(() => URL.revokeObjectURL(url), 1000);
   }
   
   export async function exportAllData(user) {
     const { data, unavailable } = await buildExport(user);
     const filename = `build-your-way-out-my-data-${new Date().toISOString().slice(0, 10)}.json`;
     await saveFile(filename, JSON.stringify(data, null, 2), "application/json;charset=utf-8");
     return { unavailable };
   }
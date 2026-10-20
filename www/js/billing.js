/* ============================================================
   Plus billing-period toggle (Monthly / Yearly), shared by the
   Account and Pricing pages. Display only: the server maps the
   chosen interval to the real Stripe price, so the browser can
   never name its own price.
   ============================================================ */

   export const BILLING_COPY = {
    month: { price: "$6.99", unit: "/mo", note: "Billed monthly. Cancel anytime." },
    year: { price: "$59", unit: "/yr", note: "Billed yearly, about $4.92 a month. Cancel anytime." }
  };
  
  export function initBillingToggle() {
    let interval = "month";
  
    function setInterval_(next) {
      interval = next === "year" ? "year" : "month";
      const copy = BILLING_COPY[interval];
  
      const priceEl = document.getElementById("plusPrice");
      const noteEl = document.getElementById("plusPriceNote");
      if (priceEl) {
        priceEl.textContent = copy.price;
        const unit = document.createElement("span");
        unit.textContent = copy.unit;
        priceEl.appendChild(unit);
      }
      if (noteEl) noteEl.textContent = copy.note;
  
      document.querySelectorAll(".billing-option").forEach((option) => {
        const active = option.dataset.interval === interval;
        option.classList.toggle("active", active);
        option.setAttribute("aria-checked", String(active));
      });
    }
  
    document.querySelectorAll(".billing-option").forEach((option) => {
      option.addEventListener("click", () => setInterval_(option.dataset.interval));
    });
  
    return { get: () => interval };
  }
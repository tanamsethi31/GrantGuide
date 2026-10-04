// Plain-English wording for catalogue fields.

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 2, minimumFractionDigits: 0 });

export const formatEur = (n) => eur.format(n);

export const formatDate = (iso) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" }) : "";

/** Short frequency for cards: "Weekly; up to 24 weeks" -> "Weekly". */
export const shortFrequency = (f) => (f || "").split(/[;(]/)[0].trim();

const TYPE_LABEL = {
  "Cash payment": "Payment",
  "Grant": "Grant",
  "Tax relief": "Tax relief",
  "Subsidy": "Reduced cost",
  "In-kind service": "Free service",
  "Loan": "Loan",
  "Shared equity": "Shared equity",
  "Fee reduction": "Fee reduction",
};
export const typeLabel = (t) => TYPE_LABEL[t] || t || "Support";

/** Headline value for a card: an amount if the catalogue has one, else the kind of help. */
export function headline(g) {
  if (g.amountEur != null) return { value: formatEur(g.amountEur), sub: shortFrequency(g.frequency) };
  return { value: typeLabel(g.benefitType), sub: shortFrequency(g.frequency) };
}

const STATUS = {
  "Ongoing scheme": { label: "Open", tone: "open" },
  "Annual or local window": { label: "Opens each year", tone: "info" },
  "Check current window": { label: "Check if open", tone: "info" },
  "Closed round": { label: "Closed", tone: "closed" },
};

/** The most important badge for a scheme: unconfirmed details outrank open/closed. */
export function statusBadge(g) {
  if (g.verification === "Official listing only") return { label: "Details not confirmed yet", tone: "warn" };
  if (g.verification === "Conflict or review needed") return { label: "Being checked", tone: "warn" };
  return STATUS[g.status] || { label: g.status || "Check if open", tone: "info" };
}

export const isClosed = (g) => g.status === "Closed round";

const MEANS = {
  Yes: "Yes, your income and means are assessed",
  No: "No, your income isn't assessed",
  Conditional: "Depends on how you qualify",
  "Not verified": "Not confirmed yet",
};
export const meansLabel = (m) => MEANS[m] || m;

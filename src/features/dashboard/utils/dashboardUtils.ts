/**
 * Formatting rules from the old Seiyone dashboard. Dates and times use the browser's Intl API
 * (old Seiyone used date-fns `h:mm a` and `MMM d, yyyy`, which are always English).
 */

/** "Good morning." before 12:00, "Good afternoon." before 17:00, otherwise "Good evening." */
export function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning.";
  if (hour < 17) return "Good afternoon.";
  return "Good evening.";
}

/** Whole-number currency in Indian grouping, e.g. ₹12,34,568 (old RevenueCard formatCurrency). */
export function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

/** "quote_sent" → "quote sent"; the cards add CSS `capitalize`, as the old ones did. */
export function formatUnderscoredLabel(value: string): string {
  return value.replace(/_/g, " ");
}

const TIME_FORMAT = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

/** "3:05 PM". Some browsers put a narrow no-break space before AM/PM; it is replaced with a normal space. */
export function formatTime(value: string): string {
  return TIME_FORMAT.formatToParts(new Date(value))
    .map((part) => (part.type === "literal" ? part.value.replace(/\s/g, " ") : part.value))
    .join("");
}

/** "Nov 14, 2026" */
export function formatDate(value: string): string {
  return DATE_FORMAT.format(new Date(value));
}

/** Format minor units (paise) as Indian Rupees, e.g. 149900 -> "₹1,499". */
export function formatINR(minor: number): string {
  return `₹${(minor / 100).toLocaleString("en-IN")}`;
}

/** Format an ISO date / instant as e.g. "05 Jun 2026". Returns the raw input if unparseable. */
export function formatDate(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/** Whole days from `from` until `to` (rounded up). Negative once `to` is in the past. */
export function daysUntil(to: string, from: Date = new Date()): number {
  const end = new Date(to);
  if (isNaN(end.getTime())) return 0;
  return Math.ceil((end.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

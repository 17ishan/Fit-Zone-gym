import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  SUCCESS: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  NEW: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  READ: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  EXPIRED: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
  FAILED: "bg-red-500/15 text-red-400 border-red-500/30",
  ARCHIVED: "bg-zinc-600/15 text-zinc-400 border-zinc-600/30",
  ADMIN: "bg-[#FF0000]/15 text-[#FF5757] border-[#FF0000]/30",
  USER: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        COLORS[value] ?? "bg-zinc-500/15 text-zinc-300 border-zinc-500/30"
      )}
    >
      {value}
    </span>
  );
}

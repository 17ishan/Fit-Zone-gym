import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A dark surface panel used across portal pages. */
export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6", className)}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[#FFFADC] sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  SUCCESS: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  EXPIRED: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  CANCELLED: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
  FAILED: "border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF5757]",
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? "border-white/15 bg-white/5 text-zinc-300";
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", style)}>
      {status}
    </span>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-zinc-400">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-[#FF0000]" />
      {label}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
      <p className="font-medium text-zinc-300">{title}</p>
      {hint && <p className="mt-1 text-sm text-zinc-500">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-[#FF0000]/30 bg-[#FF0000]/10 p-5 text-sm text-[#FF5757]">
      {message}
    </div>
  );
}

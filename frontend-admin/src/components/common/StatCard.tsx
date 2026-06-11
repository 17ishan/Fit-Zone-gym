import type { LucideIcon } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";

export function StatCard({
  label,
  value,
  icon: Icon,
  prefix = "",
  suffix = "",
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      <BorderBeam duration={8} />
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="h-5 w-5 text-[#FF5757]" />
      </div>
      <div className="mt-3 text-3xl font-bold text-foreground">
        <NumberTicker value={value} prefix={prefix} suffix={suffix} />
      </div>
    </div>
  );
}

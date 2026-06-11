import type { ReactNode } from "react";
import GradientText from "@/components/reactbits/GradientText";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <GradientText className="text-3xl font-bold" colors={["#FF0000", "#FF5757", "#FFFADC", "#FF5757", "#FF0000"]}>
          {title}
        </GradientText>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  /** kept for API compatibility — no longer used */
  size?: number;
  /** kept for API compatibility — no longer used */
  delay?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
}

/**
 * Animated gradient border. Uses the widely-supported
 * "padding + mask exclude" technique so it reliably renders as a thin
 * shimmering outline rather than a floating block.
 */
export function BorderBeam({
  className,
  duration = 6,
  colorFrom = "#FF0000",
  colorTo = "#FF6B6B",
  borderWidth = 2,
}: BorderBeamProps) {
  const style: CSSProperties = {
    padding: borderWidth,
    background: `linear-gradient(90deg, transparent 10%, ${colorFrom} 40%, ${colorTo} 60%, transparent 90%)`,
    backgroundSize: "200% 100%",
    WebkitMask:
      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    animation: `gradient-x ${duration}s linear infinite`,
  };

  return (
    <span
      aria-hidden
      style={style}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit]",
        className
      )}
    />
  );
}

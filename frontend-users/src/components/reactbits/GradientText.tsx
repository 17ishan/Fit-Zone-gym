import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#FF0000", "#FF6B6B", "#FFFADC", "#FF6B6B", "#FF0000"],
  animationSpeed = 7,
}: GradientTextProps) {
  const style: CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    animationDuration: `${animationSpeed}s`,
  };
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent animate-gradient-x",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}

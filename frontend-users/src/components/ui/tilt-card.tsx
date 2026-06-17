import type { ReactNode } from "react";
import type { MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { useInteractivityEnabled } from "@/hooks/useInteractivityEnabled";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
  /** scale on hover */
  scale?: number;
  /** render a subtle red glare layer that follows the pointer */
  glare?: boolean;
}

/**
 * Wraps content in a 3D tilt-toward-pointer effect. Composes with SpotlightCard
 * (pass SpotlightCard as the child). On touch/mobile/reduced-motion it renders a
 * plain div with the same className — zero listeners, zero transforms.
 */
export function TiltCard({
  children,
  className,
  max = 8,
  scale = 1.02,
  glare = false,
}: TiltCardProps) {
  const enabled = useInteractivityEnabled();

  // Normalized pointer position within the card: -0.5 .. 0.5
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), {
    stiffness: 200,
    damping: 20,
  });
  const glareX = useTransform(px, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(py, [-0.5, 0.5], ["0%", "100%"]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]: string[]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,0,0,0.18), transparent 60%)`
  );

  if (!enabled) {
    return <div className={cn(className)}>{children}</div>;
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale }}
        style={{
          rotateX: rx,
          rotateY: ry,
          transformStyle: "preserve-3d",
        }}
        className={cn("relative h-full", className)}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden
            style={{ background: glareBg }}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
          />
        )}
      </motion.div>
    </div>
  );
}

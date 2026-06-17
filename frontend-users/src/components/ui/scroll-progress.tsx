import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/useInteractivityEnabled";

interface ScrollProgressProps {
  className?: string;
}

/**
 * Thin fixed bar at the very top of the page that fills left→right as the
 * user scrolls. Sits above the navbar (z-[60]). Spring-smoothed normally,
 * raw progress under reduced-motion.
 */
export function ScrollProgress({ className }: ScrollProgressProps) {
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleX = reduced ? scrollYProgress : smooth;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-[3px] bg-[#FF0000]",
        className
      )}
    />
  );
}

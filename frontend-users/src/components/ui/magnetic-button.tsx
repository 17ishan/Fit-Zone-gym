import type { ButtonHTMLAttributes, MouseEvent } from "react";
import { forwardRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { useInteractivityEnabled } from "@/hooks/useInteractivityEnabled";

// motion.button redefines these handlers, so they must be omitted from the
// native button props to avoid a type clash when spread onto motion.button.
type MotionConflictKeys =
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "onDrop";

interface MagneticButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflictKeys> {
  /** how far (px) the button is pulled toward the pointer */
  strength?: number;
}

/**
 * Button that pulls toward the cursor on hover. Falls back to a plain button
 * (preserving CSS hover) on touch/mobile/reduced-motion. Forwards ref and all
 * native button props so onClick/disabled/type/className behave identically.
 */
export const MagneticButton = forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(({ children, className, strength = 18, onMouseMove, onMouseLeave, ...props }, ref) => {
  const enabled = useInteractivityEnabled();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  if (!enabled) {
    return (
      <button ref={ref} className={className} {...props}>
        {children}
      </button>
    );
  }

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLButtonElement>) => {
    x.set(0);
    y.set(0);
    onMouseLeave?.(e);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.button>
  );
});

MagneticButton.displayName = "MagneticButton";

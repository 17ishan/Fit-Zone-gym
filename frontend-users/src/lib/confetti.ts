import confetti from "canvas-confetti";

const BRAND_COLORS = ["#FF0000", "#FFFADC", "#ffffff"];

/**
 * A short brand-colored celebration burst. Callers should guard with
 * usePrefersReducedMotion() before invoking. Safe no-op outside the browser.
 */
export function fireConfetti(): void {
  if (typeof window === "undefined") return;

  const base: confetti.Options = {
    spread: 70,
    startVelocity: 45,
    ticks: 200,
    zIndex: 9999,
    colors: BRAND_COLORS,
  };

  // center pop
  confetti({ ...base, particleCount: 90, origin: { x: 0.5, y: 0.6 } });
  // two angled side bursts for a fuller effect
  confetti({
    ...base,
    particleCount: 50,
    angle: 60,
    origin: { x: 0, y: 0.7 },
  });
  confetti({
    ...base,
    particleCount: 50,
    angle: 120,
    origin: { x: 1, y: 0.7 },
  });
}

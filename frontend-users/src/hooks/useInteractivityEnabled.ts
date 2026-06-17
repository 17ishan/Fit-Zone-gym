import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

function readReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readInteractivity(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < MOBILE_BREAKPOINT;
  return !reduced && !coarse && !small;
}

/**
 * Single source of truth for "should we run motion-heavy interactions?".
 * Returns false on reduced-motion preference, touch/coarse pointers, or
 * small (mobile) viewports — so custom cursor, tilt, parallax and magnetic
 * effects can opt out uniformly.
 */
export function useInteractivityEnabled(): boolean {
  const [enabled, setEnabled] = useState<boolean>(readInteractivity);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const update = () => setEnabled(readInteractivity());

    reducedQuery.addEventListener("change", update);
    coarseQuery.addEventListener("change", update);
    window.addEventListener("resize", update);

    // Re-sync once after mount in case the SSR/initial value drifted.
    update();

    return () => {
      reducedQuery.removeEventListener("change", update);
      coarseQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return enabled;
}

/** Lighter signal: true only when the user requested reduced motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(readReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    update();
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

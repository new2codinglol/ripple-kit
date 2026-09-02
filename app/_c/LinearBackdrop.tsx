"use client";

import { useReducedMotion } from "motion/react";
import RippleGrid from "./reactbits/RippleGrid";

/* React Bits' RippleGrid as the page field for the Linear skin. Tuned well
   down from the demo defaults: a grey-blue grid rather than a coloured one,
   because the brief allows exactly one chromatic element and that is the
   acid-lime button. The grid ripples, which is the product's own name, and
   the cursor pushes a wave through it.

   It runs a requestAnimationFrame loop for as long as it is mounted, so it
   is switched off entirely under reduced motion rather than merely slowed. */
export function LinearBackdrop() {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="pointer-events-auto h-full w-full">
        <RippleGrid
          gridColor="#5a6472"
          rippleIntensity={0.06}
          gridSize={11}
          gridThickness={18}
          fadeDistance={1.6}
          vignetteStrength={1.9}
          glowIntensity={0.16}
          opacity={0.95}
          mouseInteraction
          mouseInteractionRadius={0.9}
        />
      </div>
    </div>
  );
}

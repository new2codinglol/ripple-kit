"use client";

import { useReducedMotion } from "motion/react";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

/* ShaderGradient as the ground, moved here from Tempo when that page went
   monochrome. Aero is glossy translucent panels over a moving gradient, so
   this is the thing the CSS ground was standing in for — the pearls now have
   a surface to float on and something to catch.

   Two changes from the Tempo tuning:

   1. Colours are per skin, not the Y2K swatch. A steel-blue and lilac ground
      under warm cream pearls reads as two different pages, and the whole
      reason Sand won over jade and violet was that it does not look like a
      software company picking a brand colour.

   2. grain is OFF. At grainBlending 0.06 the library renders full-intensity
      coloured static across the viewport rather than a film grain — it is
      what made Tempo look broken. The page has its own grain already: the
      fractal noise on .ground::before, multiplied at half opacity.

   It is a WebGL canvas running continuously, so it is dropped entirely under
   reduced motion and the CSS gradient on .ground shows through instead. */

const TONES = {
  /* Sand — the default skin. Warm, close in value, so the demo cards stay
     distinct surfaces rather than dissolving into the ground. */
  sand: {
    color1: "#f4ece0",
    color2: "#e2d3ba",
    color3: "#fdfbf7",
    brightness: 1.08,
    veil: "bg-white/30",
  },
  /* Void — the Linear skin. The brief forbids decorative gradients, so this
     one is pulled almost to nothing: a slow luminance wash between three
     near-blacks, no hue movement at all. It reads as the room breathing
     rather than as a gradient. */
  void: {
    color1: "#0a0b0c",
    color2: "#16181c",
    color3: "#0d0e10",
    brightness: 1.15,
    veil: "bg-[#08090a]/45",
  },
} as const;

export function Iridescence({ tone = "sand" }: { tone?: keyof typeof TONES }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  const t = TONES[tone];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <ShaderGradientCanvas
        style={{ position: "absolute", inset: 0 }}
        pixelDensity={1}
        fov={40}
        lazyLoad
      >
        <ShaderGradient
          control="props"
          type="waterPlane"
          animate="on"
          uSpeed={0.14}
          uStrength={1.05}
          uDensity={1.25}
          uFrequency={5.5}
          uAmplitude={0}
          color1={t.color1}
          color2={t.color2}
          color3={t.color3}
          cDistance={3.2}
          cPolarAngle={100}
          cAzimuthAngle={180}
          brightness={t.brightness}
          lightType="3d"
          grain="off"
          reflection={0.12}
          positionY={-0.8}
          rotationX={45}
        />
      </ShaderGradientCanvas>
      {/* Keeps the movement readable without letting it compete with the
          content sitting on top of it. */}
      <div className={`absolute inset-0 ${t.veil}`} />
    </div>
  );
}

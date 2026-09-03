"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/* Literal ripples for the Linear skin, replacing RippleGrid and the
   Iridescence void wash both. The brief allows no decorative gradients, no
   drop shadows, and hairline rings in place of shadows wherever depth is
   needed — a field of expanding hairline circles is that vocabulary already,
   and it is what the product's own name describes rather than standing in
   for it the way a warped grid did.

   Canvas 2D, not WebGL: rings are circles with a stroke and a fading alpha,
   nothing a shader earns its keep for. Dropping RippleGrid also drops ogl as
   a dependency — it had no other caller — and dropping Iridescence here
   drops one running WebGL context from this route, not two.

   Three sources, one draw loop:
   - pointer move, throttled to roughly one ring per 220ms of travel, so it
     reads as water disturbed by a hand rather than a ring per pixel
   - pointer down, one brighter ring per click
   - ambient auto-drops from randomised points every few seconds, so the
     page still moves when nobody is touching it

   No lime anywhere here — the brief reserves the single chromatic accent for
   the CTA, never the field. Rings are mist at low alpha, fading to nothing.

   Three layers, composed rather than stacked:

   1. A static gradient, CSS on the canvas element itself rather than drawn —
      it never changes, so there is nothing to gain from redrawing it 60
      times a second. Off-centre, like one distant light on still water
      rather than a flat void behind the rings.
   2. The cursor-linked glow, drawn each frame, is what makes the gradient a
      background rather than a poster: it follows the raw cursor position
      (unthrottled, so it tracks smoothly rather than in the rings' 220ms
      steps) and its brightness is not fixed — every ring drop, move or
      click, adds a pulse of "energy" that decays each frame, so the surface
      visibly warms with activity instead of just marking where the pointer
      is. This is the thing that makes layer 1 a gradient the cursor
      disturbs rather than a gradient sitting under an unrelated ripple.
   3. The rings, on top, exactly as before.

   Still monochrome throughout, still no lime — a slow luminance wash is the
   one kind of gradient the brief's own void-tone precedent already allowed,
   and composing it with the ripple's own energy value is what keeps a
   second effect from reading as two unrelated decisions stacked on the same
   route. */

type Ring = { x: number; y: number; born: number; life: number; peak: number; width: number };

const LIFE_MS = 1500;
const GLOW_RADIUS = 600;
const GLOW_BASE = 0.02;
const GLOW_ENERGY_MAX = 0.11;

// Off-centre and grey throughout — no chroma, matching the rings. First pass
// used three near-blacks about 18 RGB points apart end to end (#1a1d21 →
// #101214 → #08090a) — correct in principle, invisible in practice on a
// real screen; "restrained" had crossed into "not actually there". This
// spans the skin's own lighter token down to true void instead — smoke at
// the corner, all the way to void — so the light source reads as an actual
// light source rather than a note in the source explaining one.
const BASE_GRADIENT =
  "radial-gradient(140% 110% at 82% -12%, #383b3f 0%, #1c1f22 38%, #08090a 72%)";

export function LinearBackdrop() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsRef = useRef<Ring[]>([]);
  const lastEmitRef = useRef(0);
  const cursorRef = useRef<{ x: number; y: number } | null>(null);
  const energyRef = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!cursorRef.current) cursorRef.current = { x: w / 2, y: h / 2 };
    };
    resize();
    window.addEventListener("resize", resize);

    const drop = (x: number, y: number, peak: number, width: number) => {
      ringsRef.current.push({ x, y, born: performance.now(), life: LIFE_MS, peak, width });
      // every drop is a disturbance, so it feeds the same glow — a click
      // pushes it further than a move does, matching the brighter ring peak
      energyRef.current = Math.min(1, energyRef.current + peak * 0.9);
      // a slow, gently drifting field caps at a modest count on its own; this
      // is just a hard backstop against a runaway tab left open for hours
      if (ringsRef.current.length > 40) ringsRef.current.shift();
    };

    const onMove = (e: PointerEvent) => {
      // the glow tracks every move so it follows smoothly; only the rings
      // themselves are throttled, so the two read as one surface and one
      // disturbance rather than the glow stepping in the rings' cadence
      cursorRef.current = { x: e.clientX, y: e.clientY };
      const now = performance.now();
      if (now - lastEmitRef.current < 220) return;
      lastEmitRef.current = now;
      drop(e.clientX, e.clientY, 0.16, 1);
    };
    const onDown = (e: PointerEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      drop(e.clientX, e.clientY, 0.32, 1.4);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    let ambientTimer = window.setTimeout(function tick() {
      drop(Math.random() * w, Math.random() * h, 0.1, 1);
      ambientTimer = window.setTimeout(tick, 2600 + Math.random() * 2200);
    }, 1200);

    let raf = 0;
    const paint = () => {
      ctx.clearRect(0, 0, w, h);

      // decay toward zero each frame rather than counting down a timer, so a
      // burst of drops in quick succession (a flick across the field) keeps
      // topping it back up instead of resetting a fixed-length pulse
      energyRef.current *= 0.94;
      const c = cursorRef.current;
      if (c) {
        const alpha = Math.min(GLOW_BASE + GLOW_ENERGY_MAX, GLOW_BASE + energyRef.current * GLOW_ENERGY_MAX);
        const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, GLOW_RADIUS);
        // three stops, not two — a flat mist-to-transparent circle reads as
        // a spotlight laid over the gradient; a mist centre falling through
        // a graphite mid-tone before it clears reads as the gradient itself
        // warming, which is the point of tying it to the same surface.
        grad.addColorStop(0, `rgba(208, 214, 224, ${alpha})`);
        grad.addColorStop(0.45, `rgba(120, 128, 140, ${alpha * 0.4})`);
        grad.addColorStop(1, "rgba(208, 214, 224, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      const now = performance.now();
      ringsRef.current = ringsRef.current.filter((r) => now - r.born < r.life);
      for (const r of ringsRef.current) {
        const t = (now - r.born) / r.life; // 0 → 1
        const radius = t * 190;
        const alpha = r.peak * (1 - t);
        if (alpha <= 0.002) continue;
        ctx.beginPath();
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(208, 214, 224, ${alpha})`;
        ctx.lineWidth = r.width;
        ctx.stroke();
      }
      raf = requestAnimationFrame(paint);
    };
    raf = requestAnimationFrame(paint);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      clearTimeout(ambientTimer);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  // Reduced motion keeps the gradient — it is not motion, nothing on it
  // moves without a frame loop — and drops the canvas, so the ripple and its
  // glow are what disappear, same as before.
  if (reduced) {
    return <div aria-hidden className="fixed inset-0 z-0" style={{ background: BASE_GRADIENT }} />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: BASE_GRADIENT }}
    />
  );
}

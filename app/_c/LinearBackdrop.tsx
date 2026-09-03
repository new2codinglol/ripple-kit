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
   the CTA, never the field. Rings are mist at low alpha, fading to nothing. */

type Ring = { x: number; y: number; born: number; life: number; peak: number; width: number };

const LIFE_MS = 1500;

export function LinearBackdrop() {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsRef = useRef<Ring[]>([]);
  const lastEmitRef = useRef(0);

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
    };
    resize();
    window.addEventListener("resize", resize);

    const drop = (x: number, y: number, peak: number, width: number) => {
      ringsRef.current.push({ x, y, born: performance.now(), life: LIFE_MS, peak, width });
      // a slow, gently drifting field caps at a modest count on its own; this
      // is just a hard backstop against a runaway tab left open for hours
      if (ringsRef.current.length > 40) ringsRef.current.shift();
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastEmitRef.current < 220) return;
      lastEmitRef.current = now;
      drop(e.clientX, e.clientY, 0.16, 1);
    };
    const onDown = (e: PointerEvent) => {
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

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}

"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type PanInfo,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/* --------------------------------------------------------------------- */
/* Scroll reveal. Once only — a section that re-animates on every pass is  */
/* a section the reader has to wait for twice.                            */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.42, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------------- */
/* The one working button of the walking skeleton.                        */

export function CopyInstall({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
    } catch {
      /* Clipboard blocked (insecure context, denied permission). The command
         is selectable text either way, so fail quietly rather than alarm. */
    }
  }

  return (
    <div className="glass gloss relative flex items-center gap-3 rounded-full py-2 pl-5 pr-2">
      <code className="font-mono text-[13px] sm:text-sm">
        <span className="text-ink-soft">$</span> {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={"Copy the install command to the clipboard"}
        className="btn btn-primary relative z-10 h-9 min-w-[88px] px-4 text-[13px] font-bold"
      >
        <span
          className="block transition-[filter,opacity] duration-200"
          style={{ filter: copied ? "blur(2px)" : "none", opacity: copied ? 0 : 1 }}
        >
          Copy
        </span>
        <span
          aria-hidden
          className="absolute inset-0 grid place-items-center transition-[filter,opacity] duration-200"
          style={{ filter: copied ? "none" : "blur(2px)", opacity: copied ? 1 : 0 }}
        >
          Copied
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* Demo 1 — drag to dismiss. Velocity counts, not only distance: a quick   */
/* flick should be enough.                                                */

const DISMISS_DISTANCE = 90;
const DISMISS_VELOCITY = 320;

export function DragToDismiss() {
  const [gone, setGone] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-220, 0, 220], [0, 1, 0]);
  const rotate = useTransform(x, [-220, 220], [-7, 7]);

  function onDragEnd(_: unknown, info: PanInfo) {
    const far = Math.abs(info.offset.x) > DISMISS_DISTANCE;
    const fast = Math.abs(info.velocity.x) > DISMISS_VELOCITY;
    if (far || fast) setGone(true);
  }

  return (
    <div className="relative grid h-[136px] place-items-center">
      {gone ? (
        <motion.button
          type="button"
          onClick={() => {
            x.set(0);
            setGone(false);
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.24, ease: EASE_OUT }}
          className="btn glass-dim px-5 py-2 text-sm font-bold"
        >
          Bring it back
        </motion.button>
      ) : (
        <motion.div
          drag="x"
          dragElastic={0.16}
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={onDragEnd}
          style={{ x, opacity, rotate }}
          whileDrag={{ cursor: "grabbing" }}
          className="glass gloss relative w-full cursor-grab touch-pan-y select-none rounded-3xl px-5 py-4"
        >
          <p className="text-sm font-extrabold">Build finished</p>
          <p className="mt-0.5 text-[13px] text-ink-soft">
            Flick it either way. Velocity dismisses it, not distance.
          </p>
        </motion.div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* Demo 2 — scroll progress, spring-smoothed so it trails the scroll       */
/* rather than snapping to it.                                            */

export function ScrollRing() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });
  const dash = useTransform(smooth, (v) => `${v * 264} 264`);
  const label = useTransform(smooth, (v) => `${Math.round(v * 100)}`);

  return (
    <div ref={ref} className="relative grid h-[136px] place-items-center">
      <svg viewBox="0 0 100 100" className="h-[104px] w-[104px] -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(127,201,239,.5)" strokeWidth="7" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="var(--color-aqua)"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ strokeDasharray: dash }}
        />
      </svg>
      <div className="pointer-events-none absolute grid place-items-center">
        <motion.span className="font-mono text-xl font-bold tabular-nums">{label}</motion.span>
        <span className="text-[11px] font-bold text-ink-soft">percent</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* Demo 3 — magnetic hover. Decorative, so it is gated behind a real mouse */
/* and switched off entirely under reduced motion.                        */

export function Magnetic() {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.35 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.35 });

  function onMove(e: React.PointerEvent) {
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.32);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  }

  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="grid h-[136px] place-items-center"
    >
      <motion.button
        ref={ref}
        type="button"
        style={{ x, y }}
        onBlur={reset}
        className="btn btn-primary px-7 py-3 text-sm font-extrabold"
      >
        Pull me
      </motion.button>
    </div>
  );
}

/* --------------------------------------------------------------------- */

export function Bubbles() {
  /* Six, not three, at mixed sizes and depths. The far ones are blurred and
     slower; the near ones travel further. Nothing shares a duration, so the
     group never pulses in time with itself. */
  const bubbles = [
    { cls: "left-[4%] top-[12%] h-44 w-44", dx: "46px", dy: "104px", dur: "17s", delay: "0s", o: 0.8 },
    { cls: "right-[8%] top-[6%] h-28 w-28", dx: "-38px", dy: "76px", dur: "13s", delay: "-4s", o: 0.7 },
    { cls: "left-[34%] bottom-[4%] h-20 w-20", dx: "30px", dy: "62px", dur: "11s", delay: "-7s", o: 0.62 },
    { cls: "right-[26%] bottom-[16%] h-14 w-14", dx: "-26px", dy: "54px", dur: "9s", delay: "-2s", o: 0.55 },
    { cls: "left-[18%] top-[54%] h-10 w-10", dx: "22px", dy: "44px", dur: "8s", delay: "-5s", o: 0.5 },
    { cls: "right-[2%] top-[44%] h-36 w-36 blur-[2px]", dx: "-52px", dy: "88px", dur: "21s", delay: "-9s", o: 0.42 },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((b, i) => (
        <span
          key={i}
          className={`bubble ${b.cls}`}
          style={
            {
              "--dx": b.dx,
              "--dy": b.dy,
              "--dur": b.dur,
              animationDelay: b.delay,
              opacity: b.o,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

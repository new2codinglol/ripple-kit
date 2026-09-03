"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type PanInfo,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

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
        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--p-rim)"
          strokeOpacity="0.55" strokeWidth="7" />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="var(--p-accent)"
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

const BUBBLE_DEFS = [
  { cls: "left-[4%] top-[16%] h-44 w-44", dx: "46px", dy: "82px", dur: "17s", delay: "0s", o: 0.8 },
  { cls: "right-[8%] top-[10%] h-28 w-28", dx: "-38px", dy: "76px", dur: "13s", delay: "-4s", o: 0.7 },
  { cls: "left-[34%] bottom-[18%] h-20 w-20", dx: "30px", dy: "62px", dur: "11s", delay: "-7s", o: 0.62 },
  { cls: "right-[26%] bottom-[26%] h-14 w-14", dx: "-26px", dy: "54px", dur: "9s", delay: "-2s", o: 0.55 },
  { cls: "left-[18%] top-[58%] h-10 w-10", dx: "22px", dy: "44px", dur: "8s", delay: "-5s", o: 0.5 },
  { cls: "right-[2%] top-[46%] h-36 w-36 blur-[2px]", dx: "-52px", dy: "74px", dur: "21s", delay: "-9s", o: 0.42 },
];

// A soap bubble does not just vanish — it throws off a scatter of droplets
// as the film tears. One shockwave ring plus a handful of droplets flung
// outward and slightly down (a hint of gravity, not real physics), fired at
// the popped bubble's last on-screen position and centre so it lands where
// the bubble actually was mid-float, not its resting slot.
function BubbleBurst({
  x,
  y,
  size,
  onDone,
}: {
  x: number;
  y: number;
  size: number;
  onDone: () => void;
}) {
  const reduced = useReducedMotion();
  const droplets = useRef(
    reduced
      ? []
      : Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
          const dist = size * (0.5 + Math.random() * 0.45);
          return {
            tx: Math.cos(angle) * dist,
            ty: Math.sin(angle) * dist + size * 0.22, // settles downward
            s: 3 + Math.random() * 3,
            delay: Math.random() * 0.03,
          };
        })
  ).current;

  return (
    <div className="pointer-events-none fixed z-[1]" style={{ left: x, top: y }} aria-hidden>
      <motion.span
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70"
        style={{ width: size, height: size }}
        initial={{ opacity: 0.8, scale: 0.55 }}
        animate={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.55 }}
        transition={{ duration: reduced ? 0.12 : 0.46, ease: EASE_OUT }}
        onAnimationComplete={onDone}
      />
      {droplets.map((d, i) => (
        <motion.span
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          // sand is a pale, low-contrast ground — the same reason the glass
          // bubbles needed a real rim rather than a bare white fill. A small
          // shadow gives each droplet an edge to read against instead of
          // dissolving into the ground the instant it leaves the burst.
          style={{ width: d.s, height: d.s, boxShadow: "0 1px 3px rgba(84, 70, 50, 0.35)" }}
          initial={{ opacity: 1, x: 0, y: 0 }}
          animate={{ opacity: 0, x: d.tx, y: d.ty }}
          transition={{ duration: 0.5, delay: d.delay, ease: EASE_OUT }}
        />
      ))}
    </div>
  );
}

export function Bubbles() {
  /* Viewport-fixed, not parented to the hero. An absolutely positioned layer
     scrolls up through the sticky nav and gets hard-clipped along the pill's
     edge — frosting the nav does not help, a pale sphere behind 62% white and
     an 18px blur is simply gone. Fixed to the viewport instead, with a mask
     that is fully transparent across the nav band, so a bubble is gone
     before it can reach it either way it leaves. */
  const [popped, setPopped] = useState<Set<number>>(() => new Set());
  const poppedRef = useRef(popped);
  poppedRef.current = popped;
  const elsRef = useRef<(HTMLElement | null)[]>([]);
  const reduced = useReducedMotion();

  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const burstIdRef = useRef(0);
  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  // A click-popped bubble comes back on its own after a while — a field that
  // only ever empties would stop being a field. A scroll-hidden one does not
  // get a timer at all; it is not gone, just off past the hero, and comes
  // back the instant you scroll back up (handled below). respawns tracks
  // which indices currently have a pending timer, which is also how the
  // scroll handler tells "popped by me" apart from "popped by a click".
  const respawns = useRef<Record<number, number>>({});

  const pop = useCallback((i: number, opts?: { respawn?: boolean }) => {
    setPopped((prev) => {
      if (prev.has(i)) return prev;
      const el = elsRef.current[i];
      if (el) {
        const r = el.getBoundingClientRect();
        const id = burstIdRef.current++;
        setBursts((b) => [...b, { id, x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.width }]);
      }
      return new Set(prev).add(i);
    });
    if (opts?.respawn !== false) {
      const delay = 4200 + Math.random() * 5200;
      respawns.current[i] = window.setTimeout(() => {
        delete respawns.current[i];
        setPopped((prev) => {
          if (!prev.has(i)) return prev;
          const next = new Set(prev);
          next.delete(i);
          return next;
        });
      }, delay);
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(respawns.current).forEach((id) => clearTimeout(id));
    };
  }, []);

  // Bubbles sit at z-0, behind the page's own copy and buttons, on purpose —
  // raising them to receive real clicks would mean rendering them in front
  // of readable text. So a click never reaches the bubble element itself:
  // whatever section is painted over it always wins the DOM hit test, even
  // across its own empty background. Popping is checked manually instead —
  // any click that did not land on a real control is tested against each
  // surviving bubble's current on-screen circle (its float animation moves
  // it, so this reads the live rect, not the resting position) and popped if
  // it falls inside.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, input, textarea, select, [role='button']")) return;
      elsRef.current.forEach((el, i) => {
        if (!el || poppedRef.current.has(i)) return;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const radius = r.width / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        if (dx * dx + dy * dy <= radius * radius) pop(i);
      });
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [pop]);

  // Popping replaces fading, not just at the click — scroll past the hero
  // and whatever bubbles are still up there pop too, staggered, rather than
  // dissolving together as a group the way the old opacity ramp did. Unlike
  // a click, this is reversible: scroll back up and anything the scroll
  // itself hid (no respawn timer registered) comes straight back, while a
  // bubble a click sent away keeps waiting out its own timer regardless of
  // where the page happens to be scrolled to.
  const { scrollY } = useScroll();
  const aboveRef = useRef(true);
  useEffect(() => {
    return scrollY.on("change", (v) => {
      const above = v < 560;
      if (above === aboveRef.current) return;
      aboveRef.current = above;
      if (!above) {
        BUBBLE_DEFS.forEach((_, i) => {
          if (!poppedRef.current.has(i)) {
            setTimeout(() => pop(i, { respawn: false }), i * 55);
          }
        });
      } else {
        setPopped((prev) => {
          const next = new Set(prev);
          prev.forEach((i) => {
            if (!(i in respawns.current)) next.delete(i);
          });
          return next;
        });
      }
    });
  }, [scrollY, pop]);

  const fade =
    "linear-gradient(to bottom, transparent 0px, transparent 84px, rgba(0,0,0,.55) 130px, #000 190px)";

  return (
    <>
      <div
        aria-hidden
        style={{ maskImage: fade, WebkitMaskImage: fade }}
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <AnimatePresence>
          {BUBBLE_DEFS.map((b, i) =>
            popped.has(i) ? null : (
              <motion.span
                key={i}
                ref={(el) => {
                  elsRef.current[i] = el;
                }}
                // grows in on (re)appearance rather than snapping to full
                // size — a bubble forming, whether that is the field
                // refilling on its own or scrolling back to reveal it.
                // Enter and exit run on different curves (a slower grow, a
                // faster burst), so each carries its own transition rather
                // than sharing one at the top level — a shared transition's
                // 3-value "times" for the exit keyframes would otherwise get
                // applied to enter's plain two-value tween too.
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.35 }}
                animate={{
                  opacity: b.o,
                  scale: 1,
                  transition: { duration: reduced ? 0.1 : 0.5, ease: EASE_OUT },
                }}
                // a puff on the way out rather than a straight fade — up
                // slightly, then collapse — reads as burst instead of dissolve
                exit={
                  reduced
                    ? { opacity: 0, transition: { duration: 0.1, ease: EASE_OUT } }
                    : {
                        opacity: [1, 1, 0],
                        scale: [1, 1.16, 0.2],
                        transition: { duration: 0.32, ease: EASE_OUT, times: [0, 0.35, 1] },
                      }
                }
                className={`bubble ${b.cls}`}
                style={
                  {
                    "--dx": b.dx,
                    "--dy": b.dy,
                    "--dur": b.dur,
                    animationDelay: b.delay,
                  } as React.CSSProperties
                }
              />
            )
          )}
        </AnimatePresence>
      </div>
      {bursts.map((b) => (
        <BubbleBurst key={b.id} x={b.x} y={b.y} size={b.size} onDone={() => removeBurst(b.id)} />
      ))}
    </>
  );
}

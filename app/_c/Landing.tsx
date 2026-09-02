import {
  CopyInstall,
  DragToDismiss,
  Magnetic,
  Reveal,
  ScrollRing,
} from "./Demos";
import { Mechanism } from "./Mechanism";

const PRIMITIVES = [
  {
    name: "useDragDismiss",
    size: "1.4 kB",
    line: "Swipe a card away. Reads velocity, so a flick counts even when the distance does not.",
  },
  {
    name: "useScrollProgress",
    size: "0.9 kB",
    line: "Element progress through the viewport, spring-smoothed. Reads off a passive scroll listener.",
  },
  {
    name: "useMagnetic",
    size: "0.8 kB",
    line: "Pointer attraction with spring falloff. Ignores touch and coarse pointers on its own.",
  },
  {
    name: "useSheet",
    size: "2.1 kB",
    line: "Snap points, damping past the last one, and a drag that hands off to momentum instead of stopping dead.",
  },
  {
    name: "usePressScale",
    size: "0.4 kB",
    line: "scale(0.97) on press, 160 ms, correct curve. Four hundred bytes to stop shipping dead buttons.",
  },
  {
    name: "useInterruptible",
    size: "1.2 kB",
    line: "Retargets a running animation from its current velocity rather than restarting it from zero.",
  },
];

const DEMOS = [
  {
    title: "Drag to dismiss",
    hook: "useDragDismiss",
    note: "Distance OR velocity. Threshold-only dismissal is why so many cards feel stuck.",
    node: <DragToDismiss />,
  },
  {
    title: "Scroll progress",
    hook: "useScrollProgress",
    note: "The value is sprung, so it trails your scroll by a few frames instead of snapping to it.",
    node: <ScrollRing />,
  },
  {
    title: "Magnetic pointer",
    hook: "useMagnetic",
    note: "Spring interpolation, not a raw mouse offset. Raw offsets have no momentum and read as artificial.",
    node: <Magnetic />,
  },
];

function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="3.2" fill="var(--p-accent-deep)" />
      <circle cx="16" cy="16" r="8" fill="none" stroke="var(--p-accent)" strokeWidth="2.2" opacity=".75" />
      <circle cx="16" cy="16" r="13.4" fill="none" stroke="var(--p-accent)" strokeWidth="1.6" opacity=".4" />
    </svg>
  );
}

export function Landing() {
  return (
    <div className="relative z-10">
      {/* ---------------------------------------------------------- nav */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <nav className="glass-nav gloss relative mx-auto flex max-w-5xl items-center gap-3 rounded-full py-2 pl-4 pr-2">
          <a href="#top" className="flex items-center gap-2 font-extrabold tracking-tight">
            <Logo className="h-7 w-7" />
            <span>Ripple Kit</span>
          </a>
          <div className="ml-auto hidden items-center gap-1 text-sm font-bold sm:flex">
            {[
              ["Demos", "#demos"],
              ["Primitives", "#primitives"],
              ["Code", "#code"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="btn rounded-full px-3.5 py-2 text-ink-soft transition-colors duration-200 hover:text-ink"
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href="#install"
            className="btn btn-primary ml-auto px-4 py-2 text-sm font-extrabold sm:ml-0"
          >
            Get started
          </a>
        </nav>
      </header>

      {/* --------------------------------------------------------- hero */}
      <section id="top" className="relative px-4 pb-20 pt-16 sm:pt-24">
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="rise glass-dim mx-auto inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            v2.4 — sheet snapping is in
          </p>

          <h1
            className="rise mt-6 text-[2.6rem] font-black leading-[0.98] tracking-[-0.03em] sm:text-6xl"
            style={{ animationDelay: "60ms" }}
          >
            The gesture code you keep
            <br />
            rewriting, already correct.
          </h1>

          <p
            className="rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Nine React hooks for drag, scroll and press. Interruptible springs, ease-out on
            everything that enters, nothing over 300 ms, and reduced-motion handled before you
            ask. 9 kB for the whole set.
          </p>

          <div
            id="install"
            className="rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "180ms" }}
          >
            <CopyInstall command="npm i ripplekit" />
            <a href="#demos" className="btn glass-dim px-5 py-3 text-sm font-extrabold">
              See it move
            </a>
          </div>

          <p
            className="rise mt-5 font-mono text-xs text-ink-soft"
            style={{ animationDelay: "240ms" }}
          >
            React 18+ · zero peer deps · MIT
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------- demos */}
      <section id="demos" className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Three of them, running right here.
            </h2>
            <p className="mt-2 max-w-xl text-ink-soft">
              Not a video. These are the shipped hooks, on this page, at their default settings.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEMOS.map((d, i) => (
              <Reveal key={d.hook} delay={i * 0.06}>
                <article className="glass gloss relative flex h-full flex-col rounded-[26px] p-5">
                  <div className="relative z-10 flex items-baseline justify-between gap-3">
                    <h3 className="font-extrabold">{d.title}</h3>
                    <code className="font-mono text-[11px] text-ink-soft">{d.hook}</code>
                  </div>
                  <div className="relative z-10 my-4">{d.node}</div>
                  <p className="relative z-10 mt-auto text-[13px] leading-relaxed text-ink-soft">
                    {d.note}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- primitives */}
      <section id="primitives" className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Nine hooks. Six worth naming.
            </h2>
            <p className="mt-2 max-w-xl text-ink-soft">
              Each one is independently importable — import two, ship two. The diagram on each
              card is the decision the hook makes for you.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRIMITIVES.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.05}>
                <div className="glass-dim h-full rounded-3xl p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <code className="font-mono text-sm font-bold text-aqua-deep">{p.name}</code>
                    <span className="font-mono text-[11px] text-ink-soft">{p.size}</span>
                  </div>
                  <div className="my-4">
                    <Mechanism id={p.name} />
                  </div>
                  <p className="mt-auto text-[13px] leading-relaxed text-ink-soft">{p.line}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- code */}
      <section id="code" className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              What a dismissable card costs you.
            </h2>
          </Reveal>

          <div className="mt-8 grid min-w-0 gap-4 lg:grid-cols-2">
            <Reveal className="min-w-0">
              <div className="glass-dim h-full min-w-0 rounded-3xl p-5">
                <p className="text-[13px] font-extrabold text-ink-soft">By hand</p>
                <pre className="mt-3 overflow-x-auto font-mono text-[12px] leading-relaxed text-ink/75">
{`const [x, setX] = useState(0);
const start = useRef(0);
const t0 = useRef(0);

onPointerDown  → capture pointer, store x + time
onPointerMove  → setX(e.clientX - start.current)
onPointerUp    → const dt = Date.now() - t0.current;
                 const v  = Math.abs(x) / dt;
                 if (Math.abs(x) > 90 || v > 0.11) dismiss();
                 else animate back — but from what velocity?

// then: multi-touch guard, pointer capture on leave,
// damping past the edge, reduced motion, and the
// spring that has to retarget mid-flight instead of
// restarting from zero.`}
                </pre>
              </div>
            </Reveal>

            <Reveal delay={0.06} className="min-w-0">
              <div className="glass gloss relative h-full min-w-0 rounded-3xl p-5">
                <p className="relative z-10 text-[13px] font-extrabold text-aqua-deep">
                  With Ripple Kit
                </p>
                <pre className="relative z-10 mt-3 overflow-x-auto font-mono text-[12px] leading-relaxed">
{`import { useDragDismiss } from "ripplekit";

const card = useDragDismiss({
  onDismiss: () => remove(id),
});

return <div {...card} className="card" />;`}
                </pre>
                <div className="rule relative z-10 my-5" />
                <p className="relative z-10 text-[13px] leading-relaxed text-ink-soft">
                  Same behaviour, including the parts you would have found in review: the flick
                  threshold, the boundary damping, the pointer capture, and an exit that stays
                  faster than the entrance.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- cta */}
      <section className="px-4 py-16">
        <Reveal className="mx-auto max-w-3xl">
          <div className="glass gloss relative overflow-hidden rounded-[34px] px-6 py-12 text-center">
            <h2 className="relative z-10 text-3xl font-black tracking-tight sm:text-4xl">
              Stop shipping motion you had to guess at.
            </h2>
            <p className="relative z-10 mx-auto mt-3 max-w-md text-ink-soft">
              One install, nine hooks, and the defaults are the part you were going to get wrong.
            </p>
            <div className="relative z-10 mt-8 flex justify-center">
              <CopyInstall command="npm i ripplekit" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ------------------------------------------------------- footer */}
      <footer className="px-4 pb-10">
        <div className="mx-auto max-w-5xl">
          <div className="rule" />
          <div className="mt-6 flex flex-col gap-4 text-[13px] text-ink-soft sm:flex-row sm:items-center">
            <span className="flex items-center gap-2 font-extrabold text-ink">
              <Logo className="h-5 w-5" />
              Ripple Kit
            </span>
            <p className="sm:ml-auto sm:max-w-md sm:text-right">
              Ripple Kit is a fictional product. This page is a design-engineering portfolio
              piece by Jason Low — the library does not exist, but every interaction on the page
              does.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

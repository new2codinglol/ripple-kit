import { Landing } from "./Landing";

export const PALETTES = [
  { id: "sky", label: "Sky", swatch: "#25a6f0" },
  { id: "jade", label: "Jade", swatch: "#0e9f78" },
  { id: "sand", label: "Sand", swatch: "#e8483f" },
  { id: "violet", label: "Violet", swatch: "#6d4aff" },
] as const;

export type PaletteId = (typeof PALETTES)[number]["id"];

/* Palette review bar. Temporary — it exists so the four options can be held
   open in four tabs and compared at the same time rather than in sequence,
   which is the only way to see that two of them are the same page repainted.
   Delete this component and the three extra routes once a direction is
   chosen. */
function PaletteBar({ current }: { current: PaletteId }) {
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] -translate-x-1/2 px-4">
      <div className="glass gloss relative flex items-center gap-1 rounded-full py-1.5 pl-4 pr-1.5">
        <span className="mr-1 font-mono text-[11px] text-ink-soft">palette</span>
        {PALETTES.map((p) => {
          const on = p.id === current;
          return (
            <a
              key={p.id}
              href={p.id === "sky" ? "/" : `/${p.id}`}
              aria-current={on ? "page" : undefined}
              className="btn relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold"
              style={{
                background: on ? "var(--p-ink)" : "transparent",
                color: on ? "#f9fbfc" : "var(--p-ink-soft)",
              }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: p.swatch, boxShadow: "inset 0 0 0 1px rgba(0,0,0,.25)" }}
              />
              {p.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function Shell({ palette }: { palette: PaletteId }) {
  return (
    <div data-palette={palette} className="ground relative">
      <Landing />
      <PaletteBar current={palette} />
    </div>
  );
}

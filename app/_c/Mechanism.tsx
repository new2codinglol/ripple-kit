/* Hairline mechanism diagrams, after Consider Digital's line-art.
   Every one is 1px strokes on the page ground — no fills, no photography,
   no icon set. Each diagram shows the thing the hook actually decides, so
   the grid stops being a list of names and starts being an explanation.
   Ink hairlines carry the structure; the accent marks the one value that
   matters. */

const S = {
  line: "var(--p-ink)",
  soft: "var(--p-ink-soft)",
  hot: "var(--p-accent)",
};

const label = {
  fontSize: 7,
  letterSpacing: "0.14em",
  fill: S.soft,
  fontFamily: "var(--font-mono-jb), monospace",
} as const;

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 200 78" className="h-[78px] w-full" aria-hidden>
      {children}
    </svg>
  );
}

export function Mechanism({ id }: { id: string }) {
  switch (id) {
    /* distance is not the only way past the threshold — velocity is */
    case "useDragDismiss":
      return (
        <Frame>
          <line x1="8" y1="52" x2="192" y2="52" stroke={S.line} strokeWidth="0.6" opacity=".35" />
          <line x1="120" y1="30" x2="120" y2="62" stroke={S.line} strokeWidth="0.6" strokeDasharray="2 2" />
          <text x="124" y="68" style={label}>THRESHOLD</text>
          <rect x="20" y="36" width="34" height="22" fill="none" stroke={S.line} strokeWidth="0.9" rx="2" />
          <path d="M58 47 L150 47" stroke={S.hot} strokeWidth="1.1" />
          <path d="M150 47 l-6 -3.5 v7 z" fill={S.hot} />
          <text x="20" y="26" style={label}>FLICK · v {">"} 0.11</text>
        </Frame>
      );

    /* the sprung value trails the raw one by a few frames */
    case "useScrollProgress":
      return (
        <Frame>
          <line x1="8" y1="62" x2="192" y2="62" stroke={S.line} strokeWidth="0.6" opacity=".35" />
          <path d="M8 62 L192 16" stroke={S.line} strokeWidth="0.7" strokeDasharray="2 2" opacity=".55" />
          <path d="M8 62 C70 60 96 34 130 26 C154 20 172 17 192 16" fill="none" stroke={S.hot} strokeWidth="1.2" />
          <text x="8" y="14" style={label}>RAW</text>
          <text x="120" y="52" style={label}>SPRUNG</text>
        </Frame>
      );

    /* pull falls off with distance instead of tracking the cursor 1:1 */
    case "useMagnetic":
      return (
        <Frame>
          <circle cx="100" cy="39" r="30" fill="none" stroke={S.line} strokeWidth="0.5" opacity=".25" />
          <circle cx="100" cy="39" r="20" fill="none" stroke={S.line} strokeWidth="0.5" opacity=".4" />
          <circle cx="100" cy="39" r="10" fill="none" stroke={S.line} strokeWidth="0.6" opacity=".6" />
          <rect x="88" y="33" width="24" height="12" fill="none" stroke={S.line} strokeWidth="0.9" rx="6" />
          <path d="M158 20 L118 34" stroke={S.hot} strokeWidth="1.1" />
          <path d="M118 34 l6.5 -1 l-3 5.5 z" fill={S.hot} />
          <circle cx="160" cy="19" r="2" fill={S.hot} />
          <text x="130" y="66" style={label}>FALLOFF</text>
        </Frame>
      );

    /* three rest positions, and damping past the last one */
    case "useSheet":
      return (
        <Frame>
          {[22, 40, 58].map((y, i) => (
            <g key={y}>
              <line x1="30" y1={y} x2="170" y2={y} stroke={S.line} strokeWidth="0.6" opacity={i === 1 ? 0.9 : 0.3} strokeDasharray={i === 1 ? undefined : "2 2"} />
              <text x="174" y={y + 2.5} style={label}>{["1.0", "0.6", "0.2"][i]}</text>
            </g>
          ))}
          <rect x="52" y="34" width="70" height="12" fill="none" stroke={S.hot} strokeWidth="1.1" rx="2" />
          <path d="M87 52 L87 62" stroke={S.hot} strokeWidth="1" />
          <path d="M87 62 l-3 -5 h6 z" fill={S.hot} />
          <text x="30" y="14" style={label}>SNAP POINTS</text>
        </Frame>
      );

    /* the press is 3% — small enough to feel, too small to see */
    case "usePressScale":
      return (
        <Frame>
          <rect x="58" y="22" width="84" height="34" fill="none" stroke={S.line} strokeWidth="0.6" strokeDasharray="2 2" opacity=".5" />
          <rect x="60.5" y="23" width="79" height="32" fill="none" stroke={S.hot} strokeWidth="1.1" rx="2" />
          <text x="58" y="16" style={label}>1.00</text>
          <text x="120" y="68" style={label}>0.97 · 160MS</text>
        </Frame>
      );

    /* interrupt a spring and it keeps its velocity; a keyframe restarts */
    case "useInterruptible":
      return (
        <Frame>
          <line x1="8" y1="62" x2="192" y2="62" stroke={S.line} strokeWidth="0.6" opacity=".35" />
          <line x1="96" y1="12" x2="96" y2="66" stroke={S.line} strokeWidth="0.6" strokeDasharray="2 2" />
          <path d="M8 62 C40 62 70 34 96 28" fill="none" stroke={S.line} strokeWidth="0.9" opacity=".55" />
          <path d="M96 28 C120 24 150 20 192 18" fill="none" stroke={S.hot} strokeWidth="1.2" />
          <path d="M96 62 C122 60 154 40 192 34" fill="none" stroke={S.line} strokeWidth="0.8" strokeDasharray="2 2" opacity=".45" />
          <text x="100" y="10" style={label}>RETARGET</text>
          <text x="100" y="72" style={label}>RESTART</text>
        </Frame>
      );

    default:
      return null;
  }
}

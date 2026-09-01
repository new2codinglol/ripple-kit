# Ripple Kit — landing page

Landing page for **Ripple Kit**, a fictional React scroll-and-gesture library. Built as a
design-engineering portfolio piece: the library does not exist, every interaction on the page
does.

- **Style family:** Neo Frutiger Aero — glossy translucent panels, aqua blues, rounded humanist
  sans, bubble gradients. Deliberately not the near-black-plus-acid-accent register every
  developer-tool page defaults to.
- **Type:** Nunito (display and body) + JetBrains Mono (code and figures).
- **Motion:** [Motion](https://github.com/motiondivision/motion). Custom ease-out
  `cubic-bezier(0.23, 1, 0.32, 1)`, nothing over 300 ms on UI, `scale(0.97)` press feedback,
  hover effects gated behind `(hover: hover) and (pointer: fine)`, and `prefers-reduced-motion`
  strips movement while keeping opacity.
- **Live demos:** drag-to-dismiss (velocity *or* distance), spring-smoothed scroll progress,
  spring magnetic pointer.

## Stack

Next.js 16 · React 19 · Tailwind CSS v4 · Motion. No backend — there is no user state on the
page, so there is nothing for a database to hold.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

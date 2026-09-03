import { Landing } from "../_c/Landing";
import { LinearBackdrop } from "../_c/LinearBackdrop";

/* The Linear brief applied to the same content. No Bubbles: the brief allows
   no decorative gradients, and the spheres are nothing else. The field used
   to be React Bits' RippleGrid — a warped grid standing in for the product's
   name — and before that a near-black shader wash under it. Both are gone;
   LinearBackdrop is now a field of literal hairline ripples, which the brief
   already asks for on its own terms (rings in place of shadows) and needs no
   metaphor to justify. */
export default function Page() {
  return (
    <div data-skin="linear" className="ground relative">
      <LinearBackdrop />
      <Landing />
    </div>
  );
}

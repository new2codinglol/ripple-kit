import { Landing } from "../_c/Landing";
import { LinearBackdrop } from "../_c/LinearBackdrop";

/* The Linear brief applied to the same content. No Bubbles: the brief allows
   no decorative gradients, and the spheres are nothing else. The field is
   React Bits' RippleGrid instead — a precision grid that ripples, which is
   both the register the brief asks for and the product's own name. */
export default function Page() {
  return (
    <div data-skin="linear" className="ground relative">
      <LinearBackdrop />
      <Landing />
    </div>
  );
}

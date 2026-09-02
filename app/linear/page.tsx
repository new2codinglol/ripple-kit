import { Landing } from "../_c/Landing";

/* The Linear brief applied to the same content. No Bubbles: the brief allows
   no decorative gradients, and the spheres are nothing else. */
export default function Page() {
  return (
    <div data-skin="linear" className="ground relative">
      <Landing />
    </div>
  );
}

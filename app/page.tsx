import { Landing } from "./_c/Landing";
import { Bubbles } from "./_c/Demos";
import { Iridescence } from "./_c/Iridescence";

export default function Page() {
  return (
    <div className="ground relative">
      {/* Order is the stack: the shader sits on the CSS gradient, the pearls
          float above the shader, and the grain lies over both. */}
      <Iridescence />
      <Bubbles />
      <Landing />
    </div>
  );
}

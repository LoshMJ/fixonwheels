<<<<<<< HEAD
=======
import Section2 from "../components/home/Section2";
>>>>>>> b5786fc30ee633a12fa436dad02eca2e7eb00c68
import Hero from "../components/home/Hero";
import Section2 from "../components/home/Section2";
import Howitworks from "../components/home/Howitworks";
import Drop from "../components/home/Drop";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundImage: "url('/src/assets/galaxy-bg.jpg')" }}
    >
      <Hero />
      <Section2 />
      <Howitworks />
      <Drop />
    </div>
  );
}

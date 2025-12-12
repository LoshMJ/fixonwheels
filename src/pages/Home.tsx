import Section2 from "../components/home/Section2";
import Hero from "../components/home/Hero";
import Howitworks from "../components/home/Howitworks";

export default function Home() {
  return (
    <div 
      className="w-full min-h-screen bg-cover bg-no-repeat bg-top"
      style={{ backgroundImage: "url('/src/assets/galaxy-bg.jpg')" }}
    >
      <Hero />
      <Section2 />
      <Howitworks />
    </div>
  );
}

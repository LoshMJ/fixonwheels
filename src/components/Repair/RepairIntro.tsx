// src/components/repair/RepairIntro.tsx
import bgIntro from "../../assets/repair-intro-bg.jpg"; // use your horizon image, rename as you like
import Repair from "../../pages/Repair";
import RepairPhone from "../ui/Repairphone";

export default function RepairIntro() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
  

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        {/* LEFT: Text */}
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-300 mb-3">
            Repair • Reboot • Roll
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Let&apos;s get your{" "}
            <span className="text-purple-400">
              device back on wheels.
            </span>
          </h1>

          <p className="mt-4 text-gray-300 max-w-xl">
            Start by telling us what iPhone you&apos;re using and what&apos;s
            wrong with it. We&apos;ll guide you step-by-step from pickup to
            doorstep delivery — all in one flow.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.7)] transition">
              Start your repair
            </button>
            <button className="px-6 py-3 rounded-full border border-white/30 text-white/80 hover:bg-white/5 transition">
              View how it works
            </button>
          </div>
        </div>

        {/* RIGHT: Floating gradient phone */}
        <div className="flex-1 flex justify-center md:justify-end">
          <RepairPhone />
        </div>
      </div>
    </section>
  );
}

import React from "react";
import sectionimg from "../../assets/section2.4.jpeg";
import ExploreButton from "../ui/ExploreButton";
import { rainbowText } from "../ui/rainbowText";
import { Link } from "react-router-dom";

const Section2: React.FC = () => {
  const steps = [
    {
      title: rainbowText("Tell Us Your Issue"),
      desc: "Explain your device issue and choose the preferred repair service in just a few steps.",
    },
    {
      title: rainbowText("Book Your Doorstep Repair"),
      desc: "Pick your preferred date & time. Our technician will come to your location for repair.",
    },
    {
      title: rainbowText("Technician Arrives at Your Door"),
      desc: "A verified technician visits your home and diagnoses the issue onsite.",
    },
    {
      title: rainbowText("Get Your Device Fully Fixed"),
      desc: "Your device gets repaired quickly with original-quality parts & warranty.",
    },
  ];

  return (
    <section className="relative w-full py-24 px-4 bg-gradient-to-b from-[#0a0220] to-[#1a0630] text-white overflow-hidden">
      {/* Background image */}
      <img
        src={sectionimg}
        alt="Section background"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(155,70,255,0.25),_transparent_70%)]" />

      {/* Header */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide">
          How <span className="text-purple-400">our service</span> works
        </h2>

        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          WE BUILT A SERVICE THAT WORKS AROUND YOUR TIME, YOUR HOME, AND YOUR CONVENIENCE
        </p>
          <Link to="/repair">

        <ExploreButton className="h-12 px-8">
          Try Now
        </ExploreButton>
        </Link>
      </div>

      {/* Steps */}
      <div className="relative z-10 max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 px-4 text-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg hover:shadow-purple-900/40 transition"
          >
            <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
            <p className="text-sm opacity-80 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section2;

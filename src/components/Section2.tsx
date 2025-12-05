import React from "react";
import galaxy from "../assets/galaxy-bg.jpg";


const Section2: React.FC = () => {
  const steps = [
    {
      title: "Tell Us Your Issue",
      desc: "Explain your device issue and choose the preferred repair service in just a few steps."
    },
    {
      title: "Book Your Doorstep Repair",
      desc: "Pick your preferred date & time. Our technician will come to your location for repair."
    },
    {
      title: "Technician Arrives at Your Door",
      desc: "A verified technician visits your home and diagnoses the issue onsite."
    },
        {
          title: "Get Your Device Fully Fixed",
      desc: "Your device gets repaired quickly with original-quality parts & warranty."
        }
  ];

  return (
    <section className="relative w-full py-24 px-4 bg-gradient-to-b from-[#0a0220] to-[#1a0630] text-black overflow-hidden">
      {/* Background */}
      <img
        src={galaxy}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(155,70,255,0.25),_transparent_70%)]"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide">
          How our <span className="text-purple-400">service</span> works
        </h2>

        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-8 leading-relaxed">
          WE BUILT A SERVICE THAT WORKS AROUND YOUR TIME, YOUR HOME, AND YOUR CONVENIENCE
        </p>

        <button className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-purple-200 transition">
          Try Now
        </button>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg hover:shadow-purple-500/20 transition"
          >
            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-sm opacity-80 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section2;

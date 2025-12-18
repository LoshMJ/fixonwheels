import React from "react";
<<<<<<< HEAD
import sectionimg from "../../assets/section2.4.jpeg";
import ExploreButton from "../ui/ExploreButton";
import { rainbowText } from "../ui/rainbowText";

const Section2: React.FC = () => {
  const steps = [
  {
    title: <span className="font-semibold">{rainbowText("Tell Us Your Issue")}</span>,
    desc: "Explain your device issue and choose the preferred repair service in just a few steps."
  },
  {
    title: <span className="font-semibold">{rainbowText("Book Your Doorstep Repair")}</span>,
    desc: "Pick your preferred date & time. Our technician will come to your location for repair."
  },
  {
    title: <span className="font-semibold">{rainbowText("Technician Arrives at Your Door")}</span>,
    desc: "A verified technician visits your home and diagnoses the issue onsite."
  },
  {
    title: <span className="font-semibold">{rainbowText("Get Your Device Fully Fixed")}</span>,
    desc: "Your device gets repaired quickly with original-quality parts & warranty."
  }
];

  return (
    
    <section className="relative w-full py-24 px-4 bg-gradient-to-b from-[#0a0220] to-[#1a0630] text-white overflow-hidden">
      {/* Background */}
      <img
        src={sectionimg}
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-black/0" />
      <div className="absolute inset-90 bg-[radial-gradient(circle_at_center,_rgba(155,70,255,0.25),_transparent_70%)]"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide">
          How <span className="text-purple-400">our service</span> works
        </h2>

        <p className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-8 leading-relaxed mt-20">
          WE BUILT A SERVICE THAT WORKS AROUND YOUR TIME, YOUR HOME, AND YOUR CONVENIENCE
        </p>

        <ExploreButton className="mt-2 h-12 w-[18%]">
                    Try now
        </ExploreButton>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 px-4 text-center">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-lg hover:shadow-purple-900/90 transition"
          >
            <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
=======
import galaxy from "../../assets/galaxy-bg.jpg";


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
>>>>>>> f24a9c239ee6a59e2eab902f79615ce427c72c1b
            <p className="text-sm opacity-80 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Section2;
<<<<<<< HEAD

=======
>>>>>>> f24a9c239ee6a59e2eab902f79615ce427c72c1b

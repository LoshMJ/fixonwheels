import iphone from "../../assets/iphone.png";
import astronaut from "../../assets/astronaut.png";
import GlowButton from "../ui/GlowButton";
import ExploreButton from "../ui/ExploreButton";

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      
      <div className="absolute inset-0" />

      {/* Floating iPhone (BEHIND TEXT) */}
      <img
        src={iphone}
        className="
          absolute 
          center-[50%] 
          top-[20%]
          bottom-[+7%]
          w-[380px]
          h-[540px]
          rotate-[-10deg]
          opacity-90
          drop-shadow-[0_0_40px_rgba(168,85,247,0.8)]
          animate-float-slow
          z-[1]
        "
      />

      {/* Floating astronaut (RIGHT SIDE) */}
      <img
        src={astronaut}
        className="
          absolute 
          right-[9%] 
          top-[40%]
          w-[260px]
          animate-float-rotate
          z-[2]
        "
      />

      {/* Text content */}
      <div className="relative z-[5] text-center flex flex-col items-center gap-6 mt-[200px] ">

        <h1 className="mt-17 pt-20 text-white text-6xl font-bold leading-tight drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          Welcome to
          <span className="block text-purple-400 text-[70px] drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]">
            FixOnWheels
          </span>
        </h1>

        {/* Lowered subtitle */}
        <p className="mt-5 pt-20 text-gray-300 text-lg max-w-2xl ">
          Skip the shop. Get your device repaired at home with trusted technicians.
          Live updates. Honest pricing. Expert service delivered to your door.
        </p>

        {/* Lowered buttons */}
        <div className="mt-2 flex justify-center gap-6">
          <GlowButton className="mt-2 h-12 w-[47%] text-center">
            Get Started
          </GlowButton>


          <ExploreButton className="mt-2 h-12 w-[47%]">
            Explore
          </ExploreButton>
        </div>
      </div>
    </section>
  );
}

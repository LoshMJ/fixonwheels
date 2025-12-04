import iphone2 from "../../assets/iphone2.png";
import ExploreButton from "../ui/ExploreButton";
import astronaut from "../../assets/astronaut.png";

export default function Howitworks() {
    return (
        <section className="relative w-full min-h-screen flex items-center py-20">
            {/*astronaut*/}
            <img src={astronaut} className="absolute right-5 top-8 w-[180px] -z-0"/>
            {/*glass container*/}
            <div className="absolute right-11 left-11 mt-12 bg-white/5 backdrop-blur-sm rounded-[30px] p-14 max-w-[1300px] mx-auto flex items-center gap-16">
            {/*iphone*/}
            <img src={iphone2} className="w-[260px]  drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]" />
   
      {/*Title*/}
      <div className="flex-1 text-white text-xl leading-relaxed -mt-12"> 
      <h2 className="text-4xl font-bold mb-6">
        Built on <span className="text-emerald-300">Trust</span>, <br />
        Driven by <span className="text-emerald-300">Convenience</span>
      </h2>
      {/*Subtext*/}
      <p>
        We bring the workshop straight to your door no shops, no queues, no hassle. Our fully equipped mobile repair van gives you a personal, transparent experience with live updates at every step. Everything we do, you see. It’s repair service designed around you your time, your routine, your peace of mind.
      </p>
      </div> 
      <div className="absolute bottom-6 right-6">
      <ExploreButton>Explore</ExploreButton>
      </div>
      </div>
      </section>
    );
}
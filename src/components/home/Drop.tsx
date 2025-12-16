import { useEffect, useRef, useState } from "react";
import iphone from "../../assets/iphone2.png";
import repairman from "../../assets/astronaut.png";

export default function DropSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [play, setPlay] = useState(false);
  const [shardsExploded, setShardsExploded] = useState(false);
  const [shardsMerged, setShardsMerged] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlay(false);
          setShardsExploded(false);
          setShardsMerged(false);

          requestAnimationFrame(() => setPlay(true));

          // Shards explode after phone impact
          setTimeout(() => setShardsExploded(true), 1600);

          // Shards merge + repairman appears
          setTimeout(() => setShardsMerged(true), 2200);
        } else {
          setPlay(false);
          setShardsExploded(false);
          setShardsMerged(false);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#0a0220] flex overflow-hidden"
    >
      {/* LEFT TEXT */}
      <div className="w-1/2 flex items-center px-20 text-white z-10">
        <div>
          <h2 className="text-5xl font-bold mb-6">
            Accidents Happen.
            <span className="block text-purple-400">We Fix Them.</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-xl">
            Dropped phone? Cracked screen?  
            Our technicians fix it at your doorstep.
          </p>
        </div>
      </div>

      {/* RIGHT ANIMATION */}
      <div className="w-1/2 relative flex justify-center items-start overflow-hidden">

        {/* PHONE — hide when repairman arrives */}
        {!shardsMerged && play && (
          <img
            src={iphone}
            className={`
              w-[280px] absolute top-0 left-1/2 -translate-x-1/2
              z-20
              animate-phone-drop
              transition-opacity duration-700 ease-in-out
            `}
          />
        )}

        {/* Glass shards — hide when repairman arrives */}
        {!shardsMerged && shardsExploded && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            {[1, 2, 3, 4].map((i) => (
              <span key={i} className={`glass shard${i} explode`} />
            ))}
          </div>
        )}

        {/* Repairman */}
        {shardsMerged && (
          <img
            src={repairman}
            className={`
              w-[260px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              z-40
              animate-repairman-enter
            `}
          />
        )}

      </div>
    </section>
  );
}

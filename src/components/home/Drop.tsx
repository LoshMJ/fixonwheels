import { useEffect, useRef, useState } from "react";

type Stat = {
  label: string;
  value: number;
  suffix?: string;
};

export default function DropSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);

  const stats: Stat[] = [
    { label: "Repairs Completed", value: 1300, suffix: "+" },
    { label: "Customer Satisfaction", value: 98, suffix: "%" },
    { label: "Verified Technicians", value: 50, suffix: "+" },
    { label: "Average Response Time", value: 30, suffix: " min" },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));

  // Detect scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Animate numbers
  useEffect(() => {
    if (!start) return;

    stats.forEach((stat, index) => {
      let startValue = 0;
      const duration = 1200;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * stat.value);

        setCounts((prev) => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    });
  }, [start]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 px-6 bg-transparent"
    >
  
      {/* Glass Card */}
      <div className="relative max-w-6xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 shadow-[0_0_80px_rgba(124,58,237,0.25)]">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          Trusted by Thousands,
          <span className="block text-purple-400 mt-2">
            Built for Real Life Repairs
          </span>
        </h2>

        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-16 text-lg">
          From cracked screens to complex repairs, FixOnWheels delivers fast,
          transparent, doorstep service backed by real technicians and real
          results.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-5xl font-bold text-emerald-300 mb-3">
                {counts[index]}
                {stat.suffix}
              </div>
              <div className="text-sm uppercase tracking-wider text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

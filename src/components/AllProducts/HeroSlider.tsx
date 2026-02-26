import React, { useEffect, useMemo, useState } from "react";

type Category = { id: string; label: string; img: string };
type Slide = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  bg: string;
  rightImg: string;
};

export default function HeroSlider() {
  const categories: Category[] = useMemo(
    () => [
      {
        id: "mobile",
        label: "Mobiles",
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80&auto=format&fit=crop",
      },
      {
        id: "charger",
        label: "Chargers",
        img: "https://images.unsplash.com/photo-1616596878223-4b58fdc51e67?w=900&q=80&auto=format&fit=crop",
      },
      {
        id: "earbuds",
        label: "Earbuds",
        img: "https://images.unsplash.com/photo-1585386959984-a41552231693?w=900&q=80&auto=format&fit=crop",
      },
      {
        id: "headset",
        label: "Headsets",
        img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=900&q=80&auto=format&fit=crop",
      },
      {
        id: "case",
        label: "Mobile Cases",
        img: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=900&q=80&auto=format&fit=crop",
      },
      {
        id: "display",
        label: "Displays",
        img: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=900&q=80&auto=format&fit=crop",
      },
      {
        id: "premium",
        label: "Premium Brand",
        img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=900&q=80&auto=format&fit=crop",
      },
    ],
    []
  );

  const slides: Slide[] = useMemo(
    () => [
      {
        id: "s1",
        title: "New Season Deals",
        subtitle: "Latest mobiles, accessories, and more — best prices in one place.",
        cta: "Shop now",
        bg: "#cfe88b",
        rightImg:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400&q=80&auto=format&fit=crop",
      },
      {
        id: "s2",
        title: "Fast Charging",
        subtitle: "Safe, reliable chargers and power banks for every device.",
        cta: "Explore chargers",
        bg: "#cfe88b",
        rightImg:
          "https://images.unsplash.com/photo-1616596878223-4b58fdc51e67?w=1400&q=80&auto=format&fit=crop",
      },
      {
        id: "s3",
        title: "Audio Essentials",
        subtitle: "Earbuds & headsets — clear sound, strong bass, daily comfort.",
        cta: "Browse audio",
        bg: "#cfe88b",
        rightImg:
          "https://images.unsplash.com/photo-1585386959984-a41552231693?w=1400&q=80&auto=format&fit=crop",
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);

  // ✅ auto slide
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  const go = (i: number) => setIndex((i + slides.length) % slides.length);
  const active = slides[index];

  return (
  <section className="pt-6">
    {/* Categories (Centered) */}
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-black mb-3">
          Shop categories
        </h3>

        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((c) => (
              <div key={c.id} className="min-w-[160px]">
                <div className="bg-[#cfe88b] rounded-2xl h-[88px] flex items-center justify-center overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.label}
                    className="h-full w-full object-contain p-3"
                  />
                </div>
                <p className="text-center text-sm font-semibold mt-2 text-black">
                  {c.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Slider (Full Width) */}
    <div
className="relative max-w-[1500px] mx-auto rounded-2xl overflow-hidden"      style={{ backgroundColor: active.bg }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4 md:px-10 py-10">
        {/* Left text */}
        <div className="text-black md:max-w-[520px]">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            {active.title}
          </h1>
          <p className="mt-4 text-base md:text-lg">
            {active.subtitle}
          </p>

          <button className="mt-6 underline underline-offset-4 font-semibold">
            {active.cta}
          </button>
        </div>

        {/* Right image */}
        <div className="flex-shrink-0 w-full md:w-[520px]">
          <div className="h-[260px] md:h-[320px] rounded-2xl overflow-hidden bg-white/20">
            <img
              src={active.rightImg}
              alt={active.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* arrows */}
      <button
        onClick={() => go(index - 1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/90 shadow-md rounded-xl h-12 w-12 flex items-center justify-center"
      >
        ‹
      </button>
      <button
        onClick={() => go(index + 1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/90 shadow-md rounded-xl h-12 w-12 flex items-center justify-center"
      >
        ›
      </button>

      {/* dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            className={`h-2.5 w-2.5 rounded-full ${
              i === index ? "bg-black" : "bg-black/30"
            }`}
          />
        ))}
      </div>
    </div>
  </section>
);
}
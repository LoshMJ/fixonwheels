import { useRef, useState, useEffect } from "react";

const items = [
  {
    id: 1,
    image: "/src/assets/i17ProMax.png",
    title: "i17 Pro Max",
    desc: "Latest flagship phone",
  },
  {
    id: 2,
    image: "/src/assets/astronaut.png",
    title: "Space Case",
    desc: "Premium phone cover",
  },
  {
    id: 3,
    image: "/src/assets/galaxy-bg.jpg",
    title: "Galaxy Display",
    desc: "OLED replacement",
  },
  {
    id: 4,
    image: "/src/assets/repair-intro-bg.jpg",
    title: "Fast Charger",
    desc: "65W super fast",
  },
  {
    id: 3,
    image: "/src/assets/galaxy-bg.jpg",
    title: "Galaxy Display",
    desc: "OLED replacement",
  },
];

export default function RecentItemsSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    const width = sliderRef.current.clientWidth;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const totalScrollable = scrollWidth - clientWidth;
    setProgress((scrollLeft / totalScrollable) * 100);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full py-24 bg-black text-white relative">
      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center mb-12">
        Recently Arrived
      </h2>

      {/* SLIDER WRAPPER */}
      <div className="relative max-w-[1400px] mx-auto px-14">
        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20
                     bg-white/10 hover:bg-white/20 p-4 rounded-full"
        >
          ❮
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20
                     bg-white/10 hover:bg-white/20 p-4 rounded-full"
        >
          ❯
        </button>

        {/* SCROLL AREA */}
        <div
          ref={sliderRef}
          className="flex gap-10 overflow-x-auto scroll-smooth
                     scrollbar-hide"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="min-w-[280px] h-[380px]
                         bg-[#1a1a1a] rounded-xl overflow-hidden
                         border border-white/10
                         hover:border-purple-500 transition"
            >
              {/* IMAGE — 3/4 */}
              <div className="h-3/4 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover
                             transition-transform duration-500
                             hover:scale-110"
                />
              </div>

              {/* DESCRIPTION — 1/4 */}
              <div className="h-1/4 p-4 flex flex-col justify-center">
                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PROGRESS LINE */}
        <div className="mt-10 h-[3px] bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}

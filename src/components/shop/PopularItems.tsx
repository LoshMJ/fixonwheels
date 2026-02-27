import { useEffect, useRef, useState } from "react";
import i14 from "../../assets/phones/i14.png";
import i17ProMax from "../../assets/phones/i17ProMax.png";
import laprobo from "../../assets/laprobo.png";

const items = [
  {
    name: "iPhone 14 Pro Max",
    price: "Rs. 1,070",
    img: i14,
  },
  {
    name: "Gray-Nicolls Bat",
    price: "Rs. 80,500",
    img: i17ProMax,
  },
  {
    name: "Christmas Snowman",
    price: "Rs. 1,200",
    img: "/images/item3.jpg",
  },
  {
    name: "Christmas Gift Box",
    price: "Rs. 6,000",
    img: "/images/item4.jpg",
  },
];

export default function PopularItemsMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  // Start animation only when section visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);

          // Pause after few seconds, then resume
          setTimeout(() => setAnimate(false), 8000);
          setTimeout(() => setAnimate(true), 11000);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#9E59C7] py-14 overflow-hidden"
    >
      {/* Title */}
      <div className="flex items-center gap-3 px-10 mb-8">
        <span className="w-1 h-8 bg-yellow-400"></span>
        <h2 className="text-2xl font-semibold text-white">
          Popular Items
        </h2>
      </div>
      {/* Cartoon (STATIC) */}
      <img
        src={laprobo}
        alt="cartoon"
        className="absolute bottom-20 h-[380px] z-10 pointer-events-none align-center left-10"
      />

      {/* Moving Train */}
      <div className="ml-[450px] overflow-hidden text-black">
        <div
          className={`flex gap-6 ${
            animate ? "animate-marquee" : ""
          }`}
        >
          {[...items, ...items].map((item, index) => (
            <div
              key={index}
              className="min-w-[260px] bg-white rounded-xl p-4 shadow-lg"
            >
              <img
                src={item.img}
                className="h-50 w-full object-cover rounded-lg"
              />
              <h3 className="mt-3 font-medium text-sm">
                {item.name}
              </h3>
              <p className="text-sm font-semibold mt-1">
                {item.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

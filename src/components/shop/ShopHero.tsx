import { useState } from "react";
import ShopCard from "../ui/ShopCard";
import GradientButton from "../ui/GradientButton";
import astronaut from "../../assets/astronaut.png";
import shopbg1 from "../../assets/shopbg8.jpeg";

const shopItems = [
  {
    id: 1,
    title: "Mobiles",
    img: "/src/assets/astronaut.png",
    bg: "/src/assets/shopbg8.jpeg",
  },
  {
    id: 2,
    title: "Accessories",
    img: "/src/assets/shop/accessories.jpg",
    bg: "/src/assets/shopbg9.jpeg",
  },
  {
    id: 3,
    title: "Displays",
    img: "/src/assets/shop/display.jpg",
    bg: "/src/assets/shop/display-bg.jpg",
  },
  {
    id: 4,
    title: "Tablets",
    img: "/src/assets/astronaut.png",
    bg: "/src/assets/galaxy-bg.jpg",
  },
  {
    id: 5,
    title: "Wearables",
    img: "/src/assets/astronaut.png",
    bg: "/src/assets/galaxy-bg.jpg",
  },
];

export default function ShopSection() {
  const [active, setActive] = useState(shopItems[0]);

  return (
    <section
      className="relative h-screen w-full bg-cover bg-center transition-all duration-700"
      style={{ backgroundImage: `url(${active.bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0" />

      {/* ================= MAIN HERO CONTENT ================= */}
      <div className="relative z-10 h-full flex">
        
        {/* LEFT TEXT */}
        <div className="w-1/2 flex items-start px-40 mt-60 pt-36text-white">
          <div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Accidents Happen.
              <span className="block text-purple-400">
                We Fix Them.
              </span>
            </h2>

            <p className="text-gray-300 text-lg max-w-xl">
              Dropped phone? Cracked screen?  
              Our technicians fix it at your doorstep.
            </p>

            <GradientButton />
          </div>
        </div>

        {/* RIGHT EMPTY SPACE (visual balance) */}
        <div className="w-1/2" />
        <img
        src={astronaut}
        className="
          absolute 
          right-[10%] 
          top-[20%]
          w-[360px]
          animate-float-rotate
          z-[2]
        "
      />
      </div>

      

      {/* ================= CARDS ================= */}
      <div className="absolute bottom-12 item-center z-10 px-60">
        <div className="flex gap-6">
          {shopItems.map((item) => (
            <ShopCard
              key={item.id}
              item={item}
              active={active.id === item.id}
              onHover={() => setActive(item)}
              onClick={() => setActive(item)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

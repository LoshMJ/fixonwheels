import { useState } from "react";
import ShopCard from "../ui/ShopCard";
import GradientButton from "../ui/GradientButton";
import shopbg1 from "../../assets/shop1/add1.png";
import shopbg3 from "../../assets/shop1/add2.png";
import shopbg2 from "../../assets/shop1/add3.png";

const shopItems = [
  {
    id: 1,
    title: "Mobiles",
    img: "/src/assets/astronaut.png",
    bg: "/src/assets/shop1/add1.png",
  },
  {
    id: 2,
    title: "Accessories",
    img: "/src/assets/shop/accessories.jpg",
    bg: "/src/assets/shop1/add3.png",
  },
  {
    id: 3,
    title: "Displays",
    img: "/src/assets/shop/display.jpg",
    bg: "/src/assets/shop1/add2.png",
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

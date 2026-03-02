import { useState } from "react";
import ShopCard from "../ui/ShopCard";
import { useNavigate } from "react-router-dom";

const shopItems = [
  {
    id: 1,
    title: "Mobiles",
    img: "/src/assets/phones/i17Pro.png",
    bg: "/src/assets/shop1/add1.png",
    path: "../categories/mobiles",
  },
  {
    id: 2,
    title: "Laptops",
    img: "/src/assets/mac.avif",
    bg: "/src/assets/shop1/add3.png",
     path: "/categories/cases",
  },
  {
    id: 3,
    title: "Chargers",
    img: "/src/assets/applecharge.jpg",
    bg: "/src/assets/shop1/add2.png",
    path: "/categories/chargers",
  },
  {
    id: 4,
    title: "Displays",
    img: "/src/assets/delldisplay.jpg",
    bg: "/src/assets/galaxy-bg.jpg",
    path: "/categories/displays",
  },
  {
    id: 5,
    title: "Headsets & Earbuds",
    img: "/src/assets/sonyearbuds.jpg",
    bg: "/src/assets/galaxy-bg.jpg",
    path: "/categories/headsets",
  },
];

export default function ShopSection() {
  const [active, setActive] = useState(shopItems[0]);
  const navigate = useNavigate();

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
              onClick={() => {setActive(item);
                navigate(item.path);
              }
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

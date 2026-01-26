import React from "react";

/* ✅ DEFINE TYPE HERE */
export interface ShopItem {
  id: number;
  title: string;
  img: string;
  bg: string;
}

interface ShopCardProps {
  item: ShopItem;
  active: boolean;
  onHover: () => void;
  onClick: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({
  item,
  active,
  onHover,
  onClick,
}) => {
  return (
    <div
      onMouseEnter={onHover}
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-500
        rounded-2xl overflow-hidden relative
        ${active ? "w-[420px]" : "w-[240px] opacity-70"}
        h-[260px]
      `}
    >
      <img
        src={item.img}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-5 left-5 text-white">
        <h3 className="text-xl font-semibold">{item.title}</h3>
        <p className="text-sm opacity-80">Explore Products →</p>
      </div>

      {active && (
        <div className="absolute inset-0 ring-2 ring-pink-500/60 rounded-2xl" />
      )}
    </div>
  );
};

export default ShopCard;

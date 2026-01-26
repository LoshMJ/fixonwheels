import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  badge?: string;
}

export default function ProductCard({
  id,
  title,
  price,
  images,
  colors,
  badge,
}: Props) {
  const [index, setIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: any;
    if (index > 0) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [index, images.length]);

  return (
    <div
      onMouseEnter={() => setIndex(1)}
      onMouseLeave={() => setIndex(0)}
      onClick={() => navigate(`/product/${id}`)}
      className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col h-full"
    >
      {/* IMAGE */}
      <div className="relative h-[380px] overflow-hidden">
        {badge && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded z-10">
            {badge}
          </span>
        )}

        <img
          src={images[index]}
          alt={title}
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4 mt-auto">
        <h3 className="text-sm font-medium line-clamp-2">{title}</h3>

        <p className="mt-1 text-purple-700 font-semibold">
          RS. {price.toLocaleString()}
        </p>

        {/* COLOR SELECTOR */}
        <div className="flex gap-2 mt-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(color);
              }}
              className={`w-5 h-5 rounded-full border-2 transition ${
                selectedColor === color
                  ? "border-gray-900 scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* ADD TO CART */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("Add to cart:", {
              id,
              title,
              price,
              selectedColor,
            });
          }}
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

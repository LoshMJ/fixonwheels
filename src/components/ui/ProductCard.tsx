import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

interface Props {
  id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  models?: string[];
  badge?: string;
}

export default function ProductCard({
  id,
  title,
  price,
  images,
  colors,
  models,
  badge,
}: Props) {
  const [index, setIndex] = useState(0);

  // ✅ require selection
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const { addToCart } = useCart();
  const navigate = useNavigate();

  const needsModel = !!models?.length;

  const canAdd = useMemo(() => {
    if (!selectedColor) return false;
    if (needsModel && !selectedModel) return false;
    return true;
  }, [selectedColor, selectedModel, needsModel]);

  useEffect(() => {
    let interval: any;
    if (index > 0) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [index, images.length]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canAdd) return;

    addToCart({
      productId: id,
      title,
      price,
      image: images[0],
      options: { color: selectedColor, model: needsModel ? selectedModel : undefined },
    });

    navigate("/cart");
  };

  return (
    <div
      onMouseEnter={() => setIndex(1)}
      onMouseLeave={() => setIndex(0)}
      onClick={() => navigate(`/product/${id}`)}
      className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-[280px] overflow-hidden">
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

      <div className="p-4 mt-auto">
        <h3 className="text-sm font-medium line-clamp-2">{title}</h3>
        <p className="mt-1 text-purple-700 font-semibold">
          RS. {price.toLocaleString()}
        </p>

        {/* ✅ COLOR SELECT */}
        <div className="flex gap-2 mt-3 items-center">
          <span className="text-xs text-gray-500">Color:</span>
          {colors.map((c) => (
            <button
              key={c}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(c);
              }}
              className={`w-5 h-5 rounded-full border-2 transition ${
                selectedColor === c ? "border-gray-900 scale-110" : "border-gray-300"
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {/* ✅ MODEL SELECT (only if models exist) */}
        {needsModel && (
          <div className="mt-3">
            <label className="text-xs text-gray-500">Model:</label>
            <select
              value={selectedModel}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select model</option>
              {models!.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ✅ ADD TO CART */}
        <button
          onClick={handleAddToCart}
          disabled={!canAdd}
          className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition ${
            canAdd
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          Add to Cart
        </button>

        {/* helper message */}
        {!canAdd && (
          <p className="mt-2 text-xs text-gray-500">
            Please select {selectedColor ? "" : "color"}{!selectedColor && needsModel ? " and " : ""}{needsModel && !selectedModel ? "model" : ""} to add.
          </p>
        )}
      </div>
    </div>
  );
}
import React, { useMemo, useState } from "react";

export type ProductItem = {
  id: string;
  title: string;
  price: number;
  img: string;

  // single values (optional)
  model?: string;
  color?: string;

  // OR per-product options (optional)
  models?: string[];
  colors?: string[];
};

type Props = {
  pageTitle: string;
  products: ProductItem[];

  // optional filter lists (if you want fixed lists)
  models?: string[];
  colors?: string[];

  onAddToCart?: (item: {
    productId: string;
    title: string;
    price: number;
    img: string;
    model?: string;
    color?: string;
  }) => void;
};

const money = (n: number) => `Rs. ${n.toLocaleString("en-LK")}`;

// ✅ map color names -> css color (for circles)
const colorToCss = (c: string) => {
  const key = c.trim().toLowerCase();
  const map: Record<string, string> = {
    black: "#111827",
    white: "#ffffff",
    gray: "#9ca3af",
    grey: "#9ca3af",
    silver: "#d1d5db",
    red: "#ef4444",
    blue: "#3b82f6",
    navy: "#1e3a8a",
    green: "#22c55e",
    yellow: "#eab308",
    orange: "#f97316",
    purple: "#a855f7",
    pink: "#ec4899",
    gold: "#f59e0b",
    brown: "#92400e",
  };

  return map[key] ?? "#6b7280"; // fallback gray
};

export default function CategoryPage({
  pageTitle,
  products,
  models = [],
  colors = [],
  onAddToCart,
}: Props) {
  const [q, setQ] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const prices = useMemo(() => products.map((p) => p.price), [products]);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const [priceFrom, setPriceFrom] = useState(minPrice);
  const [priceTo, setPriceTo] = useState(maxPrice);

  // ✅ if models/colors not provided, auto-build from products
  const autoModels = useMemo(() => {
    if (models.length) return models;
    const s = new Set<string>();
    products.forEach((p) => {
      if (p.model) s.add(p.model);
      p.models?.forEach((m) => s.add(m));
    });
    return Array.from(s);
  }, [models, products]);

  const autoColors = useMemo(() => {
    if (colors.length) return colors;
    const s = new Set<string>();
    products.forEach((p) => {
      if (p.color) s.add(p.color);
      p.colors?.forEach((c) => s.add(c));
    });
    return Array.from(s);
  }, [colors, products]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return products.filter((p) => {
      const titleOk = !query || p.title.toLowerCase().includes(query);
      const priceOk = p.price >= priceFrom && p.price <= priceTo;

      const productModels = p.models?.length ? p.models : p.model ? [p.model] : [];
      const modelOk = selectedModel === "All" || productModels.includes(selectedModel);

      const productColors = p.colors?.length ? p.colors : p.color ? [p.color] : [];
      const colorOk = selectedColor === null || productColors.includes(selectedColor);

      return titleOk && priceOk && modelOk && colorOk;
    });
  }, [products, q, priceFrom, priceTo, selectedModel, selectedColor]);

  const handleAdd = (p: ProductItem) => {
    const finalModel =
      selectedModel !== "All" ? selectedModel : p.models?.[0] ?? p.model;

    const finalColor =
      selectedColor ?? p.colors?.[0] ?? p.color;

    if (onAddToCart) {
      onAddToCart({
        productId: p.id,
        title: p.title,
        price: p.price,
        img: p.img,
        model: finalModel,
        color: finalColor,
      });
      return;
    }

    alert(`Added: ${p.title}\nModel: ${finalModel ?? "-"}\nColor: ${finalColor ?? "-"}`);
  };

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 text-white">
        <h1 className="text-2xl md:text-3xl font-extrabold">{pageTitle}</h1>
        <p className="text-white/70 mt-1">Search and filter products</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
          {/* Filters */}
          <aside className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <label className="text-sm font-semibold">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products..."
              className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
            />

            <div className="mt-5">
              <p className="text-sm font-semibold">Price</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={priceFrom}
                  min={minPrice}
                  max={priceTo}
                  onChange={(e) => setPriceFrom(Number(e.target.value))}
                  className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                />
                <input
                  type="number"
                  value={priceTo}
                  min={priceFrom}
                  max={maxPrice}
                  onChange={(e) => setPriceTo(Number(e.target.value))}
                  className="rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <p className="text-xs text-white/60 mt-2">
                Range: {money(minPrice)} - {money(maxPrice)}
              </p>
            </div>

            {/* ✅ Model dropdown (styled) */}
            <div className="mt-5">
              <p className="text-sm font-semibold">Model</p>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="mt-2 w-full rounded-xl bg-black text-white border border-white/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="All">All</option>
                {autoModels.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* ✅ Color circles */}
            <div className="mt-5">
              <p className="text-sm font-semibold mb-2">Color</p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedColor(null)}
                  className={`px-3 py-1 rounded-full text-sm border transition
                    ${
                      selectedColor === null
                        ? "bg-white text-black border-white"
                        : "bg-black text-white border-white/20"
                    }`}
                >
                  All
                </button>

                {autoColors.map((c) => {
                  const css = colorToCss(c);
                  const selected = selectedColor === c;

                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      className={`relative w-9 h-9 rounded-full border-2 transition
                        ${selected ? "border-white scale-110" : "border-white/20 hover:scale-105"}
                      `}
                      style={{ backgroundColor: css }}
                    >
                      {/* ✅ small check */}
                      {selected && (
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-sm font-black
                            ${css === "#ffffff" ? "text-black" : "text-white"}
                          `}
                        >
                          ✓
                        </span>
                      )}

                      {/* ✅ white color needs inner ring */}
                      {css === "#ffffff" && (
                        <span className="absolute inset-1 rounded-full border border-black/20" />
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedColor && (
                <p className="mt-2 text-xs text-white/70">Selected: {selectedColor}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setQ("");
                setSelectedModel("All");
                setSelectedColor(null);
                setPriceFrom(minPrice);
                setPriceTo(maxPrice);
              }}
              className="mt-6 w-full rounded-xl bg-white text-black py-2 text-sm font-bold hover:opacity-90"
            >
              Clear filters
            </button>
          </aside>

          {/* Products */}
          <main className="bg-[#cfe88b] rounded-2xl p-4 md:p-6 text-black">
            <div className="flex items-center justify-between">
              <p className="font-bold">
                Showing <span className="underline">{filtered.length}</span> items
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => {
                const showModel = selectedModel !== "All" ? selectedModel : p.model ?? p.models?.[0];
                const showColor = selectedColor ?? p.color ?? p.colors?.[0];

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-sm"
                  >
                    <div className="h-44 bg-gray-50 flex items-center justify-center">
                      <img
                        src={p.img}
                        alt={p.title}
                        className="h-full w-full object-contain p-3"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://via.placeholder.com/600x400?text=No+Image";
                        }}
                      />
                    </div>

                    <div className="p-3">
                      <p className="font-semibold text-sm line-clamp-2">{p.title}</p>
                      <p className="mt-2 font-extrabold">{money(p.price)}</p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
                        {showModel && (
                          <span className="px-2 py-1 rounded-full bg-black/5">
                            Model: {showModel}
                          </span>
                        )}

                        {showColor && (
                          <span className="px-2 py-1 rounded-full bg-black/5 flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10"
                              style={{ backgroundColor: colorToCss(showColor) }}
                            />
                            Color: {showColor}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAdd(p)}
                        className="mt-3 w-full rounded-xl bg-black text-white py-2 text-sm font-semibold hover:opacity-90"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
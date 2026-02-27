import React, { useEffect, useMemo, useState } from "react";
import { api, resolveImgUrl } from "../../services/api";

export type CategoryId =
  | "mobiles"
  | "chargers"
  | "headsets"
  | "displays"
  | "cases";

export type ProductItem = {
  _id: string;
  title: string;
  price: number;
  img: string;

  oldPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;

  category?: CategoryId;

  // single values (optional)
  model?: string;
  color?: string;

  // OR per-product options (optional)
  models?: string[];
  colors?: string[];
};

type Props = {
  pageTitle: string;
  category: CategoryId; // ✅ important: used to filter from DB
  onAddToCart?: (item: {
    productId: string;
    title: string;
    price: number;
    img: string;
    model?: string;
    color?: string;
  }) => void;
};

const money = (n: number) => `Rs. ${Number(n || 0).toLocaleString("en-LK")}`;

/* =========================================================
   ✅ FIX HELPERS (ONLY for [""] issue + duplicates)
========================================================= */

// turns: ["iphone"] -> iphone, ["Black"] -> Black, ' "iphone" ' -> iphone
const cleanOne = (v: any) => {
  if (v === null || v === undefined) return "";
  let s = String(v);

  // if string contains JSON-like array: ["iphone"]
  const t = s.trim();
  if (t.startsWith("[") && t.endsWith("]")) {
    try {
      const parsed = JSON.parse(t);
      if (Array.isArray(parsed)) s = parsed[0] ?? "";
    } catch {
      // fallback: remove brackets/quotes
      s = t.replace(/[\[\]]/g, "");
    }
  }

  // remove quotes + extra brackets if any
  s = String(s).replace(/[\[\]"']/g, "").trim();

  return s;
};

// convert any input into a clean string list, remove empties, remove duplicates
const cleanList = (v: any): string[] => {
  if (!v) return [];

  // already array
  if (Array.isArray(v)) {
    const out = v.map(cleanOne).filter(Boolean);
    return Array.from(new Set(out.map((x) => x.toLowerCase()))).map((lc) => {
      // keep original casing by finding first match
      return out.find((o) => o.toLowerCase() === lc) || lc;
    });
  }

  // string might be '["iphone","samsung"]' or 'iphone'
  const s = String(v).trim();
  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return cleanList(parsed);
    } catch {
      // continue
    }
  }

  const one = cleanOne(s);
  return one ? [one] : [];
};

// ✅ map color names -> css color (for circles)
const colorToCss = (c: string) => {
  const key = cleanOne(c).trim().toLowerCase();

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

  return map[key] ?? "#6b7280";
};

export default function CategoryPage({ pageTitle, category, onAddToCart }: Props) {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // ✅ from backend
  const [products, setProducts] = useState<ProductItem[]>([]);

  // filters
  const [q, setQ] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>("All");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const [priceFrom, setPriceFrom] = useState(0);
  const [priceTo, setPriceTo] = useState(0);

  // ✅ load products
  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const data = await api<ProductItem[]>("/products"); // GET /api/products
      const arr = Array.isArray(data) ? data : [];

      // ✅ filter by category from DB
      const catProducts = arr.filter((p) => (p.category || "mobiles") === category);

      setProducts(catProducts);
    } catch (e: any) {
      setProducts([]);
      setMsg(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // reset filters when category changes
    setQ("");
    setSelectedModel("All");
    setSelectedColor(null);
  }, [category]);

  // ✅ recompute min/max and sync slider inputs when products change
  const prices = useMemo(() => products.map((p) => Number(p.price || 0)), [products]);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  useEffect(() => {
    setPriceFrom(minPrice);
    setPriceTo(maxPrice);
  }, [minPrice, maxPrice]);

  // ✅ auto-build models/colors from products (FIX: clean + dedupe)
  const autoModels = useMemo(() => {
    const all: string[] = [];
    products.forEach((p) => {
      all.push(...cleanList(p.model));
      all.push(...cleanList(p.models));
    });
    // dedupe
    const lower = new Set<string>();
    const out: string[] = [];
    for (const x of all) {
      const k = x.toLowerCase();
      if (lower.has(k)) continue;
      lower.add(k);
      out.push(x);
    }
    return out;
  }, [products]);

  const autoColors = useMemo(() => {
    const all: string[] = [];
    products.forEach((p) => {
      all.push(...cleanList(p.color));
      all.push(...cleanList(p.colors));
    });
    // dedupe
    const lower = new Set<string>();
    const out: string[] = [];
    for (const x of all) {
      const k = x.toLowerCase();
      if (lower.has(k)) continue;
      lower.add(k);
      out.push(x);
    }
    return out;
  }, [products]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return products.filter((p) => {
      const titleOk = !query || (p.title || "").toLowerCase().includes(query);

      const priceNum = Number(p.price || 0);
      const priceOk = priceNum >= priceFrom && priceNum <= priceTo;

      const productModels = [
        ...cleanList(p.models),
        ...cleanList(p.model),
      ];
      const modelOk = selectedModel === "All" || productModels.includes(selectedModel);

      const productColors = [
        ...cleanList(p.colors),
        ...cleanList(p.color),
      ];
      const colorOk = selectedColor === null || productColors.includes(selectedColor);

      return titleOk && priceOk && modelOk && colorOk;
    });
  }, [products, q, priceFrom, priceTo, selectedModel, selectedColor]);

  const handleAdd = (p: ProductItem) => {
    const productModels = [...cleanList(p.models), ...cleanList(p.model)];
    const productColors = [...cleanList(p.colors), ...cleanList(p.color)];

    const finalModel =
      selectedModel !== "All" ? selectedModel : productModels[0] ?? "";
    const finalColor =
      selectedColor ?? productColors[0] ?? "";

    if (onAddToCart) {
      onAddToCart({
        productId: p._id,
        title: p.title,
        price: p.price,
        img: p.img,
        model: finalModel || undefined,
        color: finalColor || undefined,
      });
      return;
    }

    alert(`Added: ${p.title}\nModel: ${finalModel || "-"}\nColor: ${finalColor || "-"}`);
  };

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 text-white">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">{pageTitle}</h1>
            <p className="text-white/70 mt-1">Search and filter products</p>
          </div>

          <button
            onClick={load}
            className="rounded-xl bg-white text-black px-4 py-2 text-sm font-bold hover:opacity-90"
          >
            Refresh
          </button>
        </div>

        {msg && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">
            {msg}
          </div>
        )}

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

            {/* Model dropdown */}
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

            {/* Color circles */}
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
                        ${
                          selected
                            ? "border-white scale-110"
                            : "border-white/20 hover:scale-105"
                        }
                      `}
                      style={{ backgroundColor: css }}
                    >
                      {selected && (
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-sm font-black
                            ${css === "#ffffff" ? "text-black" : "text-white"}
                          `}
                        >
                          ✓
                        </span>
                      )}

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
          <main className="bg-[#9E59C7] rounded-2xl p-4 md:p-6 text-black">
            <div className="flex items-center justify-between">
              <p className="font-bold">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    Showing <span className="underline">{filtered.length}</span> items
                  </>
                )}
              </p>
            </div>

            {!loading && filtered.length === 0 ? (
              <div className="mt-4 bg-white rounded-2xl p-6 border border-black/10">
                No products found for this category.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((p) => {
                  const productModels = [...cleanList(p.models), ...cleanList(p.model)];
                  const productColors = [...cleanList(p.colors), ...cleanList(p.color)];

                  const showModel =
                    selectedModel !== "All" ? selectedModel : productModels[0] ?? "";
                  const showColor =
                    selectedColor ?? productColors[0] ?? "";

                  return (
                    <div
                      key={p._id}
                      className="bg-white rounded-2xl border border-black/10 overflow-hidden shadow-sm"
                    >
                      <div className="h-44 bg-gray-50 flex items-center justify-center">
                        <img
                          src={resolveImgUrl(p.img)}
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
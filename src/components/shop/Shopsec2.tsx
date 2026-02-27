import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api, resolveImgUrl } from "../../services/api";
import { useNavigate } from "react-router-dom";

type CategoryId = "mobiles" | "chargers" | "headsets" | "displays" | "cases";

type ProductItem = {
  _id: string;
  title: string;
  price: number;
  img: string;
  category?: CategoryId;
  createdAt?: string;
};

const money = (n: number) => `Rs. ${Number(n || 0).toLocaleString("en-LK")}`;

// 💎 glow colors per category
function glowByCategory(cat?: CategoryId) {
  switch (cat) {
    case "mobiles":
      return { glow: "rgba(168,85,247,0.55)", ring: "rgba(168,85,247,0.20)" }; // purple
    case "chargers":
      return { glow: "rgba(34,197,94,0.55)", ring: "rgba(34,197,94,0.20)" }; // green
    case "headsets":
      return { glow: "rgba(59,130,246,0.55)", ring: "rgba(59,130,246,0.20)" }; // blue
    case "displays":
      return { glow: "rgba(249,115,22,0.55)", ring: "rgba(249,115,22,0.20)" }; // orange
    case "cases":
      return { glow: "rgba(236,72,153,0.55)", ring: "rgba(236,72,153,0.20)" }; // pink
    default:
      return { glow: "rgba(168,85,247,0.45)", ring: "rgba(255,255,255,0.10)" };
  }
}

export default function ShopSection2() {
  const navigate = useNavigate();

  const [items, setItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // carousel states
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // ✅ fetch latest products (admin added)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await api<ProductItem[]>("/products");
        const arr = Array.isArray(data) ? data : [];

        // newest first (createdAt)
        const sorted = [...arr].sort((a, b) => {
          const da = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const db = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return db - da;
        });

        // take latest 8
        const latest = sorted.slice(0, 8);

        if (!alive) return;
        setItems(latest);
        setCurrent(0);
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // 🔥 auto slide
  useEffect(() => {
    if (paused) return;
    if (items.length <= 3) return;

    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % items.length);
    }, 3000);

    return () => clearInterval(t);
  }, [paused, items.length]);

  const visible = useMemo(() => {
    if (items.length === 0) return [];
    if (items.length <= 3) return items;

    // show 3 cards: prev, current, next
    const prev = (current - 1 + items.length) % items.length;
    const next = (current + 1) % items.length;
    return [items[prev], items[current], items[next]];
  }, [items, current]);

  return (
    <section className="w-full max-w-9xl mx-auto pl-20 pr-2 py-16 bg-[url('/src/assets/galaxy-bg.jpg')] h-[calc(100vh)]">
      <div className="flex items-start justify-center mt-20">
        <motion.div
          className="w-[65%] py-10 text-purple-300 bg-black/10 rounded-3xl backdrop-blur-lg border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.25)] pl-12 pr-12"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          }}
          viewport={{ once: true, margin: "-100px" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <h2 className="text-4xl font-semibold text-center mb-10 text-white">
            New Addition
          </h2>

          {/* Cards */}
          <div className="relative flex justify-center items-start gap-10 max-w-6xl mx-auto my-2 min-h-[420px]">
            {loading ? (
              <div className="text-white/70 text-center w-full py-24">
                Loading latest items...
              </div>
            ) : items.length === 0 ? (
              <div className="text-white/70 text-center w-full py-24">
                No products found.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {visible.map((p, idx) => {
                  const isMiddle = visible.length === 3 ? idx === 1 : idx === 0;

                  return (
                    <motion.div
                      key={p._id}
                      layout
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: isMiddle ? 1.02 : 1,
                        transition: { duration: 0.45 },
                      }}
                      exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    >
                      <ProductCard
                        title={p.title}
                        image={resolveImgUrl(p.img)}
                        price={p.price}
                        category={p.category}
                        className={isMiddle ? "mt-16" : ""}
                        onLearnMore={() => {
                          const cat = p.category || "mobiles";
                          navigate(`/shop/${cat}`);
                        }}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>

          {/* ⭐ View All button */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/all-products")}
              className="rounded-full px-6 py-2 font-semibold text-sm bg-white text-black hover:opacity-90 transition"
            >
              View All New Products →
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-white/50">
            Auto-sliding • Hover to pause
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= PRODUCT CARD ================= */
function ProductCard({
  title,
  image,
  price,
  category,
  className,
  onLearnMore,
}: {
  title: string;
  image: string;
  price: number;
  category?: CategoryId;
  className?: string;
  onLearnMore?: () => void;
}) {
  const { glow, ring } = glowByCategory(category);

  return (
    <div
      className={`group w-[280px] h-[380px] relative rounded-2xl overflow-hidden
                  bg-black border border-white/10
                  transition-all duration-500 ease-out
                  hover:-translate-y-3 hover:scale-[1.03]
                  ${className}`}
      style={{ boxShadow: `0 0 35px ${ring}` }}
    >
      {/* glow overlay */}
      <div
        className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glow}, transparent 55%)`,
        }}
      />

      <img
        src={image}
        alt={title}
        className="relative z-10 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div
        className="absolute bottom-0 left-0 right-0 z-20
                   bg-black/60 backdrop-blur-xl
                   p-6 transition-all duration-500
                   group-hover:bg-black/70"
      >
        <h3 className="text-lg font-medium mb-2 text-white">{title}</h3>
        <p className="text-sm font-bold text-white/90">{money(price)}</p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onLearnMore?.();
          }}
          className="mt-2 text-sm flex items-center gap-2 text-white/70 transition-all duration-300 group-hover:text-white"
        >
          See More <span className="transition-transform group-hover:translate-x-1">↗</span>
        </button>
      </div>
    </div>
  );
}
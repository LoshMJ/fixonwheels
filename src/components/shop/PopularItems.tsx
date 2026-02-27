import { useEffect, useMemo, useRef, useState } from "react";
import laprobo from "../../assets/laprobo.png";
import { api, resolveImgUrl } from "../../services/api";

type BestSellerItem = {
  _id: string;
  title: string;
  price: number;
  img: string;
  soldCount?: number;
};

const money = (n: number) => `Rs. ${Number(n || 0).toLocaleString("en-LK")}`;

export default function PopularItemsMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  const [items, setItems] = useState<BestSellerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ load best sellers
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        const best = await api<BestSellerItem[]>("/orders/best-sellers?limit=10");
        if (!alive) return;
        setItems(Array.isArray(best) ? best : []);
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

  const renderItems = useMemo(() => {
    if (loading) return [];
    if (!items.length) return [];
    return [...items, ...items]; // repeat for marquee loop
  }, [items, loading]);

  const topId = items[0]?._id; // ✅ top 1 item

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#9E59C7] py-14 overflow-hidden"
    >
      {/* Title */}
      <div className="flex items-center gap-3 px-10 mb-8">
        <span className="w-1 h-8 bg-yellow-400"></span>
        <h2 className="text-2xl font-semibold text-white">Best Seller Items</h2>
      </div>

      {/* Cartoon (STATIC) */}
      <img
        src={laprobo}
        alt="cartoon"
        className="absolute bottom-20 h-[380px] z-10 pointer-events-none align-center left-10"
      />

      {/* Moving Train */}
      <div className="ml-[450px] overflow-hidden text-black">
        {loading ? (
          <div className="text-white/80 px-4 py-10">Loading best sellers...</div>
        ) : !items.length ? (
          <div className="text-white/80 px-4 py-10">No best seller items found.</div>
        ) : (
          <div className={`flex gap-6 ${animate ? "animate-marquee" : ""}`}>
            {renderItems.map((item, index) => {
              const isTop = item._id === topId && index === 0;

              return (
                <div
                  key={`${item._id}-${index}`}
                  className="min-w-[260px] bg-white rounded-xl p-4 shadow-lg relative"
                >
                  {/* 💰 Trending badge for top 1 */}
                  {isTop && (
                    <div className="absolute -top-3 -left-3 z-20">
                      <div className="px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-extrabold flex items-center gap-1 animate-bounce">
                        Trending <span className="font-black">↑</span>
                      </div>
                    </div>
                  )}

                  <img
                    src={resolveImgUrl(item.img)}
                    className="h-50 w-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/600x400?text=No+Image";
                    }}
                    alt={item.title}
                  />

                  <h3 className="mt-3 font-medium text-sm">{item.title}</h3>
                  <p className="text-sm font-semibold mt-1">{money(item.price)}</p>

                  {typeof item.soldCount === "number" && (
                    <p className="text-xs text-gray-500 mt-1">
                      Sold: {item.soldCount.toLocaleString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
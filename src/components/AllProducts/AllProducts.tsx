import React, { useMemo, useRef } from "react";
import HeroSlider from "./HeroSlider";
import { Link } from "react-router-dom";

type Product = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  rating?: number; // 0-5
  reviews?: number;
  img: string;
  badge?: string; // "Best Seller", etc
};

type Section = {
  id: string;
  title: string;
  promoImg: string;
  products: Product[];
};

const money = (n: number) => `Rs. ${n.toLocaleString("en-LK")}`;

function Stars({ value = 0 }: { value?: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        return (
          <span
            key={i}
            className={`text-sm ${isFull || isHalf ? "text-orange-500" : "text-gray-300"}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  return (
    <div
      data-card="true"
      className="min-w-[230px] max-w-[230px] bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden"
    >
      <div className="h-40 w-full bg-gray-50 flex items-center justify-center">
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
        {p.badge && (
          <div className="inline-block text-[11px] px-2 py-1 rounded-full bg-black text-white mb-2">
            {p.badge}
          </div>
        )}

        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{p.title}</p>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-extrabold text-gray-900">{money(p.price)}</span>
          {p.oldPrice && (
            <span className="text-xs text-gray-400 line-through">{money(p.oldPrice)}</span>
          )}
        </div>

        {(p.rating || p.reviews) && (
          <div className="mt-2 flex items-center gap-2">
            <Stars value={p.rating} />
            <span className="text-xs text-gray-500">
              {p.rating?.toFixed(1)} {p.reviews ? `(${p.reviews.toLocaleString()})` : ""}
            </span>
          </div>
        )}

        <button className="mt-3 w-full rounded-xl bg-black text-white py-2 text-sm font-semibold hover:opacity-90">
          Add to cart
        </button>
      </div>
    </div>
  );
}

function SectionRow({ section }: { section: Section }) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = (dir: "left" | "right") => {
    const el = rowRef.current;
    if (!el) return;

    // ✅ if there is no overflow, no need to scroll
    if (el.scrollWidth <= el.clientWidth) return;

    // ✅ get REAL card width from DOM (works even if you change card size)
    const firstCard = el.querySelector<HTMLElement>("[data-card='true']");
    const cardW = firstCard?.offsetWidth ?? 230;

    // ✅ get REAL gap
    const styles = window.getComputedStyle(el);
    const gap = parseInt(styles.gap || "16", 10) || 16;

    const amount = (cardW + gap) * 3;

    el.scrollTo({
      left: dir === "right" ? el.scrollLeft + amount : el.scrollLeft - amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative bg-[#cfe88b] rounded-2xl p-4 md:p-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg md:text-xl font-extrabold text-gray-900">{section.title}</h2>
          <Link
  to={`/shop/${section.id}`}
  className="text-sm font-semibold underline underline-offset-4"
>
  See more
</Link>
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        {/* Left promo box */}
        <div className="hidden md:block w-[280px] min-w-[280px] bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5">
          <div className="h-full w-full">
            <img
              src={section.promoImg}
              alt={`${section.title} promo`}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/600x800?text=Promo";
              }}
            />
          </div>
        </div>

        {/* Products row */}
        <div className="relative flex-1">
          <div
            ref={rowRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 px-14"
            style={{ scrollbarWidth: "thin" }}
          >
            {section.products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => scrollByCards("right")}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md border border-black/10 rounded-xl h-12 w-12 flex items-center justify-center hover:scale-105 transition"
            aria-label="Scroll right"
          >
            <span className="text-2xl">›</span>
          </button>

          {/* Left arrow */}
          <button
            type="button"
            onClick={() => scrollByCards("left")}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-50 bg-white shadow-md border border-black/10 rounded-xl h-12 w-12 flex items-center justify-center hover:scale-105 transition"
            aria-label="Scroll left"
          >
            <span className="text-2xl">‹</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllProducts() {
  const sections: Section[] = useMemo(
    () => [
      {
        id: "mobiles",
        title: "Mobiles: new arrivals",
        promoImg:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop",
        products: [
          {
            id: "m1",
            title: "Samsung Galaxy A Series (Multiple Models)",
            price: 79999,
            oldPrice: 89999,
            rating: 4.5,
            reviews: 3204,
            img: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&auto=format&fit=crop",
            badge: "Best Seller",
          },
          {
            id: "m2",
            title: "iPhone Compatible Refurb (Various)",
            price: 129999,
            rating: 4.3,
            reviews: 910,
            img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "m3",
            title: "Xiaomi Redmi Series (Latest)",
            price: 62999,
            oldPrice: 69999,
            rating: 4.4,
            reviews: 1402,
            img: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "m4",
            title: "OPPO / vivo Mid-range Picks",
            price: 74999,
            rating: 4.2,
            reviews: 803,
            img: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "m5",
            title: "Budget Smartphones (Multiple Brands)",
            price: 34999,
            rating: 4.1,
            reviews: 222,
            img: "https://images.unsplash.com/photo-1512499617640-c2f999098c01?w=800&q=80&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "chargers",
        title: "Chargers: fast & safe",
        promoImg:
          "https://images.unsplash.com/photo-1603539947678-cd3954ed515d?w=1200&q=80&auto=format&fit=crop",
        products: [
          {
            id: "c1",
            title: "USB-C Fast Charger 20W / 25W",
            price: 3990,
            rating: 4.6,
            reviews: 1200,
            img: "https://images.unsplash.com/photo-1612810436541-336fab0ff449?w=800&q=80&auto=format&fit=crop",
            badge: "Top Rated",
          },
          {
            id: "c2",
            title: "PD Charger 45W (Laptop + Phone)",
            price: 7990,
            oldPrice: 8990,
            rating: 4.4,
            reviews: 540,
            img: "https://images.unsplash.com/photo-1616596878223-4b58fdc51e67?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "c3",
            title: "Cable: Type-C to Type-C (1m/2m)",
            price: 1490,
            rating: 4.5,
            reviews: 980,
            img: "https://images.unsplash.com/photo-1612810436613-23c2fefbce7f?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "c4",
            title: "Power Bank 10,000mAh",
            price: 9990,
            rating: 4.3,
            reviews: 210,
            img: "https://images.unsplash.com/photo-1609592421961-01b2a3c0b6c0?w=800&q=80&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "headsets",
        title: "Headsets & Earbuds",
        promoImg:
          "https://images.unsplash.com/photo-1518441311925-10f1f0db4f2e?w=1200&q=80&auto=format&fit=crop",
        products: [
          {
            id: "h1",
            title: "Wireless Earbuds (Noise Isolation)",
            price: 12990,
            rating: 4.4,
            reviews: 3291,
            img: "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "h2",
            title: "Over-ear Bluetooth Headset",
            price: 18990,
            oldPrice: 21990,
            rating: 4.2,
            reviews: 870,
            img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80&auto=format&fit=crop",
            badge: "Hot Deal",
          },
          {
            id: "h3",
            title: "Wired Earphones (Type-C/3.5mm)",
            price: 2990,
            rating: 4.1,
            reviews: 640,
            img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80&auto=format&fit=crop",
          },
        ],
      },
      {
        id: "displays",
        title: "Phone Displays & Screens",
        promoImg:
          "https://images.unsplash.com/photo-1586941963939-9d1f31d2d3d5?w=1200&q=80&auto=format&fit=crop",
        products: [
          {
            id: "d1",
            title: "Samsung Display Replacement (Multiple Models)",
            price: 18990,
            rating: 4.3,
            reviews: 188,
            img: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "d2",
            title: "iPhone Display Replacement (Various)",
            price: 22990,
            rating: 4.4,
            reviews: 260,
            img: "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "d3",
            title: "Tempered Glass (2-Pack)",
            price: 1590,
            rating: 4.6,
            reviews: 3400,
            img: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80&auto=format&fit=crop",
            badge: "Best Seller",
          },
        ],
      },
      {
        id: "cases",
        title: "Mobile Cases & Covers",
        promoImg:
          "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1200&q=80&auto=format&fit=crop",
        products: [
          {
            id: "mc1",
            title: "Shockproof Case (Many Models)",
            price: 1490,
            rating: 4.5,
            reviews: 930,
            img: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "mc2",
            title: "Clear Case + Camera Guard",
            price: 1990,
            rating: 4.3,
            reviews: 410,
            img: "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80&auto=format&fit=crop",
          },
          {
            id: "mc3",
            title: "Premium Leather Flip Cover",
            price: 3490,
            oldPrice: 3990,
            rating: 4.2,
            reviews: 120,
            img: "https://images.unsplash.com/photo-1601593348361-857f8c6c16d0?w=800&q=80&auto=format&fit=crop",
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      {/* Hero Slider at top */}
      <HeroSlider />

      {/* Existing sections */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-6 text-black">
        {sections.map((s) => (
          <SectionRow key={s.id} section={s} />
        ))}
      </div>
    </>
  );
}
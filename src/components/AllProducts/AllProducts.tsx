import React, { useMemo, useRef } from "react";
import HeroSlider from "./HeroSlider";
import { Link } from "react-router-dom";

type Product = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  rating?: number; 
  reviews?: number;
  img: string;
  badge?: string; 
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

    //  if there is no overflow, no need to scroll
    if (el.scrollWidth <= el.clientWidth) return;

    //  get REAL card width from DOM (works even if you change card size)
    const firstCard = el.querySelector<HTMLElement>("[data-card='true']");
    const cardW = firstCard?.offsetWidth ?? 230;

    //  get REAL gap
    const styles = window.getComputedStyle(el);
    const gap = parseInt(styles.gap || "16", 10) || 16;

    const amount = (cardW + gap) * 3;

    el.scrollTo({
      left: dir === "right" ? el.scrollLeft + amount : el.scrollLeft - amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative bg-[#9E59C7] rounded-2xl p-4 md:p-6 overflow-hidden">
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
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
  products: [
    {
      id: "m1",
      title: "Samsung Galaxy A Series (Multiple Models)",
      price: 79999,
      oldPrice: 89999,
      rating: 4.5,
      reviews: 3204,
      img: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80",
      badge: "Best Seller",
    },
    {
      id: "m2",
      title: "iPhone Compatible Refurb (Various)",
      price: 129999,
      rating: 4.3,
      reviews: 910,
      img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "m3",
      title: "Xiaomi Redmi Series (Latest)",
      price: 62999,
      oldPrice: 69999,
      rating: 4.4,
      reviews: 1402,
      img: "https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1679574085.06263133.png",
    },
    {
      id: "m4",
      title: "OPPO / vivo Mid-range Picks",
      price: 74999,
      rating: 4.2,
      reviews: 803,
      img: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "m5",
      title: "Budget Smartphones (Multiple Brands)",
      price: 34999,
      rating: 4.1,
      reviews: 222,
      img: "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=800&q=80",
    },
  ],
},
{
  id: "chargers",
  title: "Chargers: fast & safe",
  promoImg:
    "https://m.media-amazon.com/images/I/71EwwAVNpoL._AC_SL1500_.jpg",
  products: [
    {
      id: "c1",
      title: "USB-C Fast Charger 20W / 25W",
      price: 3990,
      rating: 4.6,
      reviews: 1200,
      img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUPEBAPDw8QEBAPEBAQDw8PEBAQFRUXFhURFRUYHSggGRolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFQ8PFTMZFRkrNysuKzctMzcvLTMrODc3Ny4rNzc4NzguLisuKzcrLS04OCwrLi0tKzA3MCsrNysrL//AABEIANwA5QMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAQMEAgUGB//EAEAQAAIBAgIGBwUGBQQCAwAAAAABAgMRITEEBRIyQXEiUWFygbHBEzNSkaFCYoKy0fAGFSOSwlNjc+HD8QcUNP/EABkBAQEBAQEBAAAAAAAAAAAAAAABAgUDBP/EACERAQEBAAEDBAMAAAAAAAAAAAABEQIDBBIhYXHhEzFR/9oADAMBAAIRAxEAPwD9xK9I3Jd2XkWFekPovtjK3bgB5zhC2Co8be67LepZSjBTVvZ7zts7F+zLHK55ey+qX9rL9Bi/aRwefU1wZMV7xh15/wDmqdxm4w67x0eoli3B2SzZUeTFYeBXpfu59yf5WXKLtk/kyvSoP2c1Z7k+D6mRX0Oi7ke7HyLSrRtyPdj5FpUAAAAAAAgCQQAJIAAAAAAAAAAkEACQAAM+l/Z7z/LI0GfS/s83+WQGelkuRZTzXP0ZVTyXItp5rn6MDTS3VyXkZtNz/CvzGmlurkvIzabn+FfmA5CAQGjR/wDGPmy4p0f/ABj5suAAAAAABAAAAgCQQAJBAAkEACQQSAAAAAASZ9L+zzf5ZGgz6X9nvP8AKwM1PJci2nmufoyqnkuRbTzXP0YGmlurkvIzabn+FfmRppbq5LyM2m+i/MgOQgEBo0f/ABj5suKdH/xXmy4AAAAYIAAEAACAAuRchsDoXKZ1LZK5MKl1cC0k5JAkEEgSCCQAAAkAAfO6fokHXnJxi22sWl8ETdqTR4w29lJX2b2VsnL9SnTV/VlzX5YmzVaz8PNlG4qq0VLO+VsLddy0EHi6fWqQq7EdjYtF9KMnK7v1NLgWaunOc2p7Oyk2tlNO91ndvrI1mv6q7sf8i7Vi6T5epRvhBL5Jfv5nQBAAAAgkgAQeRPWjjpEqUsErOC+KLim/E9P2itfO4HU1dNXtdNX6jwP4f0yrK8ZRn0Hsyk07N955yXE9pzZyB05nIAA43XdZHYYHcJfLyLDLF7L7C+LA7JIRKAkkgASAAJAAHia32oVE1FS27vGTjayS6mbtUp7G00k5cE72s2syjXG9DlL0Ner/AHa8fNgaQAB5Gt5qM05NRTjFJtpK95dZdqmSldxaksrppq/URrpXUe8y3VS6D7z8kUbQAQAAAK6tRRWJ3J2V+oxQq7d08/QDmVGnKaquEXUS2Yyau4rs6sy0qydixMCQCAJBAAAAA1ciErYMkiSuBcmdpmanPgy5MCxEnKZIHQIAHQAA8vW+9DlL0Nmr/drx82Y9b70OUvQ2av8Adrx82BoAAHj/AMQ6VGmqe1fpSaVlfJFWia2jGFownN7XBJLhxf7xOP4t0eU1S2VfZnJvFdRm1foekONoxio7V7zlk+jwT7Fw6+s5Pcdz3PHr3p8ON8P7OO/T6eHT6d4Tlb6/LVV1/UinL2K2V/uceq9j3kz5ypqCq4tOcG228drNq2fgfRxWC5Hr2N7i3l+bc9M3Pff0z1fDJ4JAB0Xg4qq6aPPnFp34o9KSwMlSN+YHKe2u31OYu2BWpbLvw4l01dXX7QHQOISOwAAAAEASCABzJcTuEr4EHMlbEC5MsTKYO/P94HcWBbcEJkAZ/bP/AFPpH9DpVpfFF+H6M8/+W0/if9zI/lkeFSa8UaxFmsZtuN7ZSy8DXoVZKCTT44rFZs8uro7g1eTle9r8CyNStHGMVKHDHHtGD2oVYvJq/Vk/kdniLWUcqkXHmsDZRrJ7k/B4omKjXGUe8yzVe5+J+SM2sqjaimrO+ayZp1XuPvPyRBsAAAAADLUVmainSFgBlqRuV0amy7PJ/RlqkV1YAWVI2xWRMZHGj1Psvw7UJKzAsBCZIAAAATbC+SWLbwSRlqafFbi9o/ieFPwf2vDDtA1qPy6+BlqabBbi9q+u9qf93HwTMdWcp772vu5QXKP63ZBcZ1c9MrcJwXYqfR8U3f6m7QtIdSF5JKcZbErZXsndc00/E8s3aq3an/L/AOOmKSt6BKII08j+WQ/1J/3Ifyz4as/ozV/JqfxVf7l+hy9TpbtWquey/RF0YqlCUGtqe3e9sLWO46TUhlByhwaz7fqTpOjSptKU/aXvbC1vqdQr1IL3UpU+Eo9LngscyomGnUp4SVnxTRE9XwfSpy2X914fIlV6FXCSV+3NM4loEo40pvut3XzArqe1Vo1LNLFSXE26FOywlaV724NcjFU0icrRnFxksexna0RzW3GTjNYdjQHsU698Hg/o+TLjw6OmtP2dZWfXwZ6VOs459KPXm1+qJYrUCE74rFEkAp0hYFxXWWAHlKraWy8nlz6jQmZdMpkaLXv0XvL6rrAuqRtkX05qSs8/UrTvgV4xd0BcsMCxMi20rrP94Getpaj0YJTmsHJ7kX1fefZ9UBqthd2SWLbdkl1mSpp8V7tbb+KV1Dw4y8n1mOpJyd5ycmsVfdT7I5Lnn2kFxnXVWcp4zk5cUsorlH1d32kHhfxfrmWiaLKtTSlUVShSV8VH2tSMNq3FpPLrsYv/AI11rW0rV8aukVPa1va1ozm1FXtLK0Ulx6io+qBAA6N2qd2f/IvyRMF/0SWbfBI9fQqOxGz3m9qVvifDwSS8CVY0oEkEadgADy9b70OUvQ2av92vHzZj1vvQ5S9DZq/3a8fNgNJ0OnU34pv4spLxWJgnoFWljSltx+CVlLweT+h64A8CtpW3ZNOM4vpRas0RapH+pDFLBx44cUb9cRXRdle7V+Nuoxw0mVPFx/pt22uCl1Pq4GtRbCpTrxs8+rimURnOg7SvKm8pdXMs0jRVL+pSdp54ZS5nWjaSqidOorSWDTA2UatulHGLxa9UbIyTV1imeCnLR5Wd3Sbw+72Hp0aqWKxg8X2dpLFbCJIkEHn6VTPKrRad1g0e9XgeZpFMBQqqSv8ANdTLnjzPMjJwlfg812G+E+K5oBpE3CCSbUql8eMYLNrtxS8ewxpWwWCNWtN+m+Dpz+jh+v0MpqM0IDZAR87/ABpq+tpOiV6NCMZ1XLRalOM3aLdOrCbTfVaLw/Un+A9Qy0DQ46PN3nd1J4qSU5YySfVe/wBD6A6pwcsYrBZyb2YLnL9LsKXOqUHLGKw4yb2YL8X6XO404rh7R/eTVNfhzl4lyTbu3d8OpclwJpjvRqKi7rpS+K1rdkVw5vE9CmZYI0QZGlwITIAtAAHl633ocpehs1f7tePmzHrfehyl6GzV/u14+bA0AADz9cZR7zO9XRTptNJptpp4pqyONcZR7zLNV7j7z8kBhr0ZaM9qN5UW8Vm4f9do0rR1USqU3aayfX2M9mSTVning08mjxp0paPUSinKlN2ilduL+H9+hYJ0auqsXCa6SwkmTq+hUi3BtbF+i3jJ+HqdrR47ftLdJq2eHPtZ26uLUelJcFkub4DRvpQ2Va7a4X8jsx6FXc49KyldppLdaeX/AGaoSvzyZAmjFXpm8pqwA8WvTKtGqbL2Xk3h2PqPQr0zBXpAa9Y7lKX33Hw2JesUY2aKU1UpeylJQnFqUJPFNp3V+vin2MrlotRb3so9vtXs+HRv9CxmxSTTg5bqulnJvZgucv0u+wuVKKz/AKj7U401+HOXjgdyvLN3tkskuSyQ1ZFcacV/uPtTjTX4c5eOHYWO8t53tl1LkskdRgWxiRXEYF0IkqJ2kAiiyJykdpAWRBKAFoAA8vW+9DlL0Nmr/drx82Y9b70OUvQ2av8Adrx82BoAAHn64yj3mWar3H3n5Ir1xlHvMs1XuPvPyQGwhq5IA8zT4SSeze6abte7j2Wx7fAq0ek3Lbazvh0l0r221F5Xj14npaUkouTwUU231JZniVZTr03KDlCGcUsJzt19SfUBpraZGlik5SclfZXHLpPJcO010Kstrak47MsEorBdWPHqMWjqNWhspJYWsuA1ZUcoOD3otouI9oho5oz2op8ePPidkVnq0zLPR7noNHEogeb/APRi8yyGjRjlFLwxNjiRsgY5USFSNmwNgDMqZ2oF+wTsAUqJ0oluwNkDhI6SOtkmwEA6IAsAAHl633ocpehs1f7tePmzHrfehyl6GzV/u14+bA0AADz9cZR7zLNV7j7z8kV64yj3mWar3PxPyQGwAAQ1fB4p4HjaCvZznReUX0e2LxX0PaPJ1pHYq06nxXhLwxXm/kBRof8ATrSp8H0o+P7Y93pHZUX1/dhrNbM4VF17L8TrWy6Mai+zJfJ/+zSPT0Z2bj12kvJ+nzNBiozxjLrw+f8A3Y2kqhy0dAg4sLHViQOLCx2AObCx0AObCx0AObE2JAEWBIAAADy9b70OUvQ2av8Adrx82ZNb70OUvQ16v92vHzYGgAAefrjKPeZZqvc/E/JFeuMo95lmq9x95+SA2AAAYNdwvRb4wlGS+dn9GzeZ9YRvSmuunP52YHmaf0qG11JS+R1V6ej/AIfqRR6WjtfdaGr3eh4M0izQql6SfVZ/JnrHiap9011XR7NN3SfWkSq6ABAAAAAAAAAAAAAAAAAAAHl633ocpehs1f7tePmzHrfehyl6GzV/u14+bA0AADz9cZR7zLNV7j7z8kV64yj3mWar3PxPyQGwAADiuujLuvyOyvSX0Jd2XkB5OrvceD8iNUe5+ZOge48GRqn3Pz8jSGqNyXeZ69Dcj3Y+R5GqNyXeZ7FDdj3V5EquwAQAAAAAAAAAAAAAAAAf/9k=",
      badge: "Top Rated",
    },
    {
      id: "c2",
      title: "PD Charger 45W (Laptop + Phone)",
      price: 7990,
      oldPrice: 8990,
      rating: 4.4,
      reviews: 540,
      img: "https://m.media-amazon.com/images/I/511YWPmqDXL._AC_UF1000,1000_QL80_.jpg",
    },
    {
      id: "c3",
      title: "Cable: Type-C to Type-C (1m/2m)",
      price: 1490,
      rating: 4.5,
      reviews: 980,
      img: "https://gadgetceylon.lk/wp-content/uploads/2025/06/UGREEN-Uno-100W-Type-C-to-Type-C-PD-5A-Max-2m-Cable-L509-35512-Gadgetceylon-1.webp",
    },
  ],
},
{
  id: "headsets",
  title: "Headsets & Earbuds",
  promoImg:
    "https://media.product.which.co.uk/prod/images/original/ed5f4f3bc904-wireless-heaphones-lead.jpg",
  products: [
    {
      id: "h1",
      title: "Wireless Earbuds (Noise Isolation)",
      price: 12990,
      rating: 4.4,
      reviews: 3291,
      img: "https://m.media-amazon.com/images/I/61bcY1YYXoL.jpg",
    },
    {
      id: "h2",
      title: "Over-ear Bluetooth Headset",
      price: 18990,
      oldPrice: 21990,
      rating: 4.2,
      reviews: 870,
      img: "https://img.drz.lazcdn.com/static/lk/p/72d56abf0a2d6cd7dd7c51cc468b459e.jpg_720x720q80.jpg",
      badge: "Hot Deal",
    },
    {
      id: "h3",
      title: "Wired Earphones (Type-C/3.5mm)",
      price: 2990,
      rating: 4.1,
      reviews: 640,
      img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    },
  ],
},
{
  id: "displays",
  title: "Phone Displays & Screens",
  promoImg:
    "https://www.tataneu.com/pages/electronics/_next/image?url=https%3A%2F%2Fd1msew97rp2nin.cloudfront.net%2Fprodin%2Ftnelectronics%2Fblogimages%2F25cca7cf-9b6c-4ec5-b409-5e9f1acebe31.webp&w=3840&q=75",
  products: [
    {
      id: "d1",
      title: "Samsung Display Replacement (Multiple Models)",
      price: 18990,
      rating: 4.3,
      reviews: 188,
      img: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "d2",
      title: "iPhone Display Replacement (Various)",
      price: 22990,
      rating: 4.4,
      reviews: 260,
      img: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "d3",
      title: "Tempered Glass (2-Pack)",
      price: 1590,
      rating: 4.6,
      reviews: 3400,
      img: "data:image/jpeg;base64,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",
      badge: "Best Seller",
    },
  ],
},

{
  id: "cases",
  title: "Laptops: work & gaming",
  promoImg:
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
  products: [
    {
      id: "l1",
      title: "Dell Inspiron 15 (i5 / 8GB / 512GB SSD)",
      price: 238000,
      oldPrice: 255000,
      rating: 4.6,
      reviews: 720,
      img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
      badge: "Top Rated",
    },
    {
      id: "l2",
      title: "HP Pavilion 15 (i5 / 8GB / 512GB SSD)",
      price: 245000,
      oldPrice: 265000,
      rating: 4.7,
      reviews: 690,
      img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80",
      badge: "Best Seller",
    },
    {
      id: "l3",
      title: "MacBook Air (M1 / 8GB / 256GB)",
      price: 325000,
      oldPrice: 350000,
      rating: 4.9,
      reviews: 1340,
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
      badge: "Premium",
    },
    {
      id: "l4",
      title: "Gaming Laptop (i7 / 16GB / 512GB / RTX)",
      price: 420000,
      oldPrice: 450000,
      rating: 4.8,
      reviews: 260,
      img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=800&q=80",
      badge: "Gaming",
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
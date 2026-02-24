import React, { useMemo } from "react";
import CategoryPage from "./CategoryPage";

type ProductItem = {
  id: string;
  title: string;
  price: number;
  img: string;
  model?: string;
  color?: string;
};

export default function HeadsetsPage() {
  const products: ProductItem[] = useMemo(
    () => [
      {
        id: "h1",
        title: "Wireless Earbuds (Noise Isolation)",
        price: 12990,
        img: "https://images.unsplash.com/photo-1585386959984-a41552231693?w=800&q=80&auto=format&fit=crop",
        models: ["Earbuds Pro", "Earbuds Lite"],
        colors: ["Black", "White"],
      },
      {
        id: "h2",
        title: "Over-ear Bluetooth Headset",
        price: 18990,
        img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80&auto=format&fit=crop",
        models: ["BT-900", "BT-1000"],
        colors: ["Black", "Gray"],
      },
      {
        id: "h3",
        title: "Wired Earphones (Type-C / 3.5mm)",
        price: 2990,
        img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80&auto=format&fit=crop",
        models: ["Type-C", "3.5mm"],
        colors: ["Black", "White"],
      },
    ],
    []
  );

  return <CategoryPage pageTitle="Headsets & Earbuds" products={products} />;
}
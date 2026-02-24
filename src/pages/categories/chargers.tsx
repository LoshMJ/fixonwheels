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


export default function ChargersPage() {
  const products: ProductItem[] = useMemo(
    () => [
      {
        id: "c1",
        title: "USB-C Fast Charger (PD)",
        price: 3990,
        img: "https://images.unsplash.com/photo-1616596878223-4b58fdc51e67?w=800&q=80&auto=format&fit=crop",
        models: ["20W", "25W"],
        colors: ["White", "Black", "Blue", "Red"],
      },
      {
        id: "c2",
        title: "PD Charger 45W (Laptop + Phone)",
        price: 7990,
        img: "https://images.unsplash.com/photo-1612810436541-336fab0ff449?w=800&q=80&auto=format&fit=crop",
        models: ["45W"],
        colors: ["White", "Black", "Blue", "Red"],
      },
      {
        id: "c3",
        title: "Type-C to Type-C Cable",
        price: 1490,
        img: "https://images.unsplash.com/photo-1612810436613-23c2fefbce7f?w=800&q=80&auto=format&fit=crop",
        models: ["1m", "2m"],
        colors: ["White", "Black", "Blue", "Red"],
      },
    ],
    []
  );

  return <CategoryPage pageTitle="Chargers" products={products} />;
}
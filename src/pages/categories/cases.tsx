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

export default function CasesPage() {
  const products: ProductItem[] = useMemo(
    () => [
      {
        id: "mc1",
        title: "Shockproof Case (Many Models)",
        price: 1490,
        img: "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&q=80&auto=format&fit=crop",
        models: ["iPhone 13", "A14", "Redmi Note"],
        colors: ["Black", "Blue", "Red"],
      },
      {
        id: "mc2",
        title: "Clear Case + Camera Guard",
        price: 1990,
        img: "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80&auto=format&fit=crop",
        models: ["iPhone 12", "iPhone 13", "S21"],
        colors: ["Clear"],
      },
      {
        id: "mc3",
        title: "Premium Leather Flip Cover",
        price: 3490,
        img: "https://images.unsplash.com/photo-1601593348361-857f8c6c16d0?w=800&q=80&auto=format&fit=crop",
        models: ["A24", "A14", "Redmi Note"],
        colors: ["Brown", "Black"],
      },
    ],
    []
  );

  return <CategoryPage pageTitle="Cases & Covers" products={products} />;
}
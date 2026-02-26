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
export default function DisplaysPage() {
  const products: ProductItem[] = useMemo(
    () => [
      {
        id: "d1",
        title: "Samsung Display Replacement",
        price: 18990,
        img: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=800&q=80&auto=format&fit=crop",
        models: ["A14", "A24", "S21"],
        colors: ["Black", "White"],
      },
      {
        id: "d2",
        title: "iPhone Display Replacement",
        price: 22990,
        img: "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?w=800&q=80&auto=format&fit=crop",
        models: ["iPhone 11", "iPhone 12", "iPhone 13"],
        colors: ["Black"],
      },
      {
        id: "d3",
        title: "Tempered Glass (2-Pack)",
        price: 1590,
        img: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&q=80&auto=format&fit=crop",
        models: ["Universal", "Samsung", "iPhone"],
        colors: ["Clear"],
      },
    ],
    []
  );

  return <CategoryPage pageTitle="Displays & Screens" products={products} />;
}
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

export default function MobilesPage() {
  const products = useMemo<ProductItem[]>(
    () => [
      {
        id: "m1",
        title: "Samsung Galaxy A14 (4GB/128GB)",
        price: 52999,
        model: "Samsung A14",
        color: "Black",
        img: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "m2",
        title: "iPhone 13 (Refurb) 128GB",
        price: 129999,
        model: "iPhone 13",
        color: "Blue",
        img: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "m3",
        title: "Xiaomi Redmi Note Series",
        price: 62999,
        model: "Redmi Note",
        color: "Gray",
        img: "https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800&q=80&auto=format&fit=crop",
      },
      {
        id: "m4",
        title: "Xiaomi Redmi Note Series",
        price: 62999,
        model: "Redmi",
        color: "Red",
        img: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&auto=format&fit=crop",
      },
    ],
    []
  );

  return <CategoryPage pageTitle="Mobiles" products={products} />;
}
import { useEffect, useState } from "react";
import { publicApi } from "../lib/api";

export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];
  models?: string[];    
  badge?: string;
}

export const products: Product[] = [
  {
    id: "1",
    title: "iphone 16",
    price: 385000,
    images: [
      "/src/assets/phones/i16.png",
      "/src/assets/i16.webp",
      "/src/assets/phones/i16plus.png",
    ],
    colors: ["#195b44", "#e866b6", "#1c4992"],
    models: ["256GB", "128GB", "512GB"], 
    badge: "Best Seller",
  },

  {
    id: "2",
    title: "iphone 13",
    price: 250000,
    images: [
      "/src/assets/phones/i13.png",
      "/src/assets/i13ProMax.jpeg",
      "/src/assets/phones/i13Pro.png",
    ],
    colors: ["#0c3e1e", "#a41a1e", "#0c0c0c"],
    models: ["Standard", "Premium"], 
  },

  {
    id: "3",
    title: "iphone11",
    price: 165000,
    images: [
      "/src/assets/phones/i11.png",
      "/src/assets/phones/i11Pro.png",
    ],
    colors: ["#d3c139", "#e9852eb7"],
    models: ["256GB", "128GB", "512GB"], 
    badge: "Best Seller",
  },

  {
    id: "4",
    title: "iphone10",
    price: 95000,
    images: [
      "/src/assets/phones/i10.png",
      "/src/assets/phones/i10S.png",
      "/src/assets/phones/i10R.png",

    ],
    colors: ["#f3eded", "#e9852eb7", "#b21f1f"],
    models: ["Standard", "Premium"], 
    badge: "Best Seller",
  },

  {
    id: "5",
    title: "iphone 17",
    price: 585000,
    images: [
      "/src/assets/phones/i17.png",
      "/src/assets/phones/i17Air.png",
      "/src/assets/phones/i17ProMax.png",
      "/src/assets/phones/i17Pro.png",
    ],
    colors: ["#589ad0", "#e8df7cf3", "#dc2626"],
    models: ["256GB", "128GB", "512GB"], 
  },

  {
    id: "6",
    title: "i12",
    price: 3850,
    images: [
      "/src/assets/phones/i12.png",
      "/src/assets/phones/i12Pro.png",
      "/src/assets/phones/i12ProMax.png",
    ],
    colors: ["#130b45", "#dbddb7"],
    models: ["256GB", "128GB", "512GB"], 
    badge: "Best Seller",
  },
  
];

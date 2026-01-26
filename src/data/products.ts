export interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  colors: string[];   // 👈 ADD THIS
  badge?: string;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Christmas Gift Hamper",
    price: 3850,
    images: [
      "/src/assets/astronaut.png",
      "/src/assets/galaxy-bg.jpg",
      "/src/assets/laprobo.png",
    ],
    colors: ["#000000", "#9333ea", "#dc2626"], // 👈 PER PRODUCT
    badge: "Best Seller",
  },
  {
    id: "2",
    title: "Scarlet Velvet Cake",
    price: 11490,
    images: [
      "/src/assets/astronaut.png",
      "/src/assets/galaxy-bg.jpg",
      "/src/assets/laprobo.png",
    ],
    colors: ["#7c2d12", "#dc2626", "#facc15"],
  },
  {
    id: "3",
    title: "Christmas Gift Hamper",
    price: 3850,
    images: [
      "/src/assets/astronaut.png",
      "/src/assets/galaxy-bg.jpg",
      "/src/assets/laprobo.png",
    ],
    colors: ["#000000", "#9333ea", "#dc2626"], // 👈 PER PRODUCT
                badge: "Sold Out X",

  },
  {
    id: "4",
    title: "Christmas Gift Hamper",
    price: 3850,
    images: [
      "/src/assets/astronaut.png",
      "/src/assets/galaxy-bg.jpg",
      "/src/assets/laprobo.png",
    ],
    colors: ["#000000", "#9333ea", "#dc2626"], // 👈 PER PRODUCT
  },
  {
    id: "5",
    title: "Christmas Gift Hamper",
    price: 3850,
    images: [
      "/src/assets/astronaut.png",
      "/src/assets/galaxy-bg.jpg",
      "/src/assets/laprobo.png",
    ],
    colors: ["#000000", "#9333ea", "#dc2626"], // 👈 PER PRODUCT
  },
  {
    id: "6",
    title: "Christmas Gift Hamper",
    price: 3850,
    images: [
      "/src/assets/astronaut.png",
      "/src/assets/galaxy-bg.jpg",
      "/src/assets/laprobo.png",
    ],
    colors: ["#000000", "#9333ea", "#dc2626"], // 👈 PER PRODUCT
            badge: "Best Seller",

  },
];

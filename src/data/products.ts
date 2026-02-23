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
    title: "Christmas Gift Hamper",
    price: 3850,
    images: [
      "/src/assets/astronaut.png",
      "/src/assets/galaxy-bg.jpg",
      "/src/assets/laprobo.png",
    ],
    colors: ["#000000", "#9333ea", "#dc2626"],
    models: ["Standard", "Premium"], 
    badge: "Best Seller",
  },

  {
    id: "2",
    title: "Christmas Gift Hamper",
    price: 3850,
    images: [
      "/src/assets/astronaut.png",
      "/src/assets/galaxy-bg.jpg",
      "/src/assets/laprobo.png",
    ],
    colors: ["#000000", "#9333ea", "#dc2626"],
    models: ["Standard", "Premium"], 
    badge: "Best Seller",
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
    colors: ["#000000", "#9333ea", "#dc2626"],
    models: ["Standard", "Premium"], 
    badge: "Best Seller",
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
    colors: ["#000000", "#9333ea", "#dc2626"],
    models: ["Standard", "Premium"], 
    badge: "Best Seller",
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
    colors: ["#000000", "#9333ea", "#dc2626"],
    models: ["Standard", "Premium"], 
    badge: "Best Seller",
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
    colors: ["#000000", "#9333ea", "#dc2626"],
    models: ["Standard", "Premium"], 
    badge: "Best Seller",
  },
  
];
/*import img1 from "../assets/astronaut.png";

images: [img1, img1, img1]*/
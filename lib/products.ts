export type Category = "desk" | "chair" | "monitor" | "lamp" | "plant" | "accessory";
export type Product = { id: string; name: string; category: Category; price: number; description: string; detail: string; color: string };

export const products: Product[] = [
  { id: "desk-arc", name: "Arc Standing Desk", category: "desk", price: 720000, description: "Warm oak · sit/stand", detail: "160 × 75 cm", color: "#c68b52" },
  { id: "desk-cove", name: "Cove Executive Desk", category: "desk", price: 580000, description: "Natural teak · storage", detail: "140 × 70 cm", color: "#9c6a44" },
  { id: "desk-sand", name: "Sand Compact Desk", category: "desk", price: 420000, description: "Light ash · small spaces", detail: "120 × 60 cm", color: "#d6b77f" },
  { id: "chair-cloud", name: "Cloud Ergonomic Chair", category: "chair", price: 490000, description: "Breathable mesh · lumbar support", detail: "12h comfort", color: "#f3e6d2" },
  { id: "chair-coral", name: "Coral Task Chair", category: "chair", price: 360000, description: "Soft fabric · height adjustable", detail: "Cinnamon weave", color: "#cf755b" },
  { id: "chair-tide", name: "Tide Office Chair", category: "chair", price: 430000, description: "Padded comfort · swivel base", detail: "Ocean blue", color: "#436c7b" },
  { id: "monitor-studio", name: "Studio Display", category: "monitor", price: 450000, description: "27-inch 4K monitor", detail: "USB-C included", color: "#272c2b" },
  { id: "lamp-sunset", name: "Sunset Task Lamp", category: "lamp", price: 140000, description: "Dimmable warm light", detail: "LED · 3000K", color: "#e7a43d" },
  { id: "plant-bali", name: "Bali Green Plant", category: "plant", price: 95000, description: "Lush, low-maintenance greenery", detail: "Ceramic pot", color: "#5d8b62" },
  { id: "mat-woven", name: "Woven Desk Mat", category: "accessory", price: 85000, description: "Textured vegan leather surface", detail: "Keyboard-friendly", color: "#bd7954" }
];

export const byId = (id: string) => products.find((item) => item.id === id)!;
export const formatIDR = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

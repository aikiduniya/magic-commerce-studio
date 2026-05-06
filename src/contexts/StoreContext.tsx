import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { extractColorsFromImage, applyThemeColors, ExtractedColors } from "@/utils/colorExtractor";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  description: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export interface Visitor {
  id: string;
  page: string;
  date: string;
  device: string;
  country: string;
}

export interface StoreSettings {
  name: string;
  logo: string;
  email: string;
  phone: string;
  themeColors: ExtractedColors;
}

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (s: Partial<StoreSettings>) => void;
  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  addCategory: (c: Category) => void;
  updateCategory: (id: string, c: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  orders: Order[];
  addOrder: (o: Omit<Order, "id" | "date" | "status"> & { status?: Order["status"] }) => Order;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  visitors: Visitor[];
  banners: Banner[];
  addBanner: (b: Banner) => void;
  updateBanner: (id: string, b: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
}

const defaultSettings: StoreSettings = {
  name: "LUXE Store",
  logo: "",
  email: "hello@luxestore.com",
  phone: "+1 (555) 123-4567",
  themeColors: { primary: "220 90% 56%", secondary: "220 14% 94%", accent: "340 82% 52%" },
};

const defaultCategories: Category[] = [
  { id: "1", name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", productCount: 3 },
  { id: "2", name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", productCount: 2 },
  { id: "3", name: "Home & Living", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400", productCount: 2 },
  { id: "4", name: "Sports", image: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?w=400", productCount: 1 },
];

const defaultProducts: Product[] = [
  { id: "1", name: "Wireless Headphones Pro", price: 299, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", category: "Electronics", stock: 45, description: "Premium noise-cancelling headphones", featured: true },
  { id: "2", name: "Smart Watch Ultra", price: 499, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", category: "Electronics", stock: 23, description: "Advanced fitness & health tracker", featured: true },
  { id: "3", name: "Leather Jacket", price: 189, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", category: "Fashion", stock: 15, description: "Classic Italian leather jacket" },
  { id: "4", name: "Minimalist Desk Lamp", price: 79, image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400", category: "Home & Living", stock: 60, description: "Modern LED desk lamp" },
  { id: "5", name: "Running Shoes X", price: 159, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", category: "Sports", stock: 38, description: "Ultra-lightweight running shoes", featured: true },
  { id: "6", name: "Portable Speaker", price: 129, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400", category: "Electronics", stock: 52, description: "Waterproof bluetooth speaker" },
  { id: "7", name: "Silk Scarf", price: 65, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400", category: "Fashion", stock: 30, description: "Hand-crafted silk scarf" },
  { id: "8", name: "Ceramic Vase Set", price: 95, image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400", category: "Home & Living", stock: 20, description: "Artisan ceramic vase set" },
];

const defaultOrders: Order[] = [
  { id: "ORD-001", customer: "Alice Johnson", email: "alice@email.com", items: [{ productId: "1", name: "Wireless Headphones Pro", qty: 1, price: 299 }], total: 299, status: "delivered", date: "2026-03-01" },
  { id: "ORD-002", customer: "Bob Smith", email: "bob@email.com", items: [{ productId: "2", name: "Smart Watch Ultra", qty: 1, price: 499 }, { productId: "4", name: "Minimalist Desk Lamp", qty: 2, price: 158 }], total: 657, status: "shipped", date: "2026-03-04" },
  { id: "ORD-003", customer: "Carol Williams", email: "carol@email.com", items: [{ productId: "5", name: "Running Shoes X", qty: 1, price: 159 }], total: 159, status: "processing", date: "2026-03-06" },
  { id: "ORD-004", customer: "David Lee", email: "david@email.com", items: [{ productId: "3", name: "Leather Jacket", qty: 1, price: 189 }], total: 189, status: "pending", date: "2026-03-08" },
];

const defaultVisitors: Visitor[] = [
  { id: "v1", page: "/", date: "2026-03-08", device: "Desktop", country: "US" },
  { id: "v2", page: "/products", date: "2026-03-08", device: "Mobile", country: "UK" },
  { id: "v3", page: "/products/1", date: "2026-03-07", device: "Desktop", country: "DE" },
  { id: "v4", page: "/", date: "2026-03-07", device: "Tablet", country: "FR" },
  { id: "v5", page: "/products/2", date: "2026-03-06", device: "Mobile", country: "US" },
  { id: "v6", page: "/categories", date: "2026-03-06", device: "Desktop", country: "CA" },
  { id: "v7", page: "/", date: "2026-03-05", device: "Mobile", country: "AU" },
  { id: "v8", page: "/products/5", date: "2026-03-05", device: "Desktop", country: "US" },
];

const defaultBanners: Banner[] = [
  { id: "1", title: "Spring Collection 2026", subtitle: "Discover our latest arrivals with up to 40% off", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920", buttonText: "Shop Now", buttonLink: "#products", active: true },
  { id: "2", title: "Premium Electronics", subtitle: "The latest tech at unbeatable prices", image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1920", buttonText: "Explore", buttonLink: "#products", active: true },
  { id: "3", title: "Free Shipping", subtitle: "On all orders over $100 this week only", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920", buttonText: "Learn More", buttonLink: "#features", active: true },
];

const StoreContext = createContext<StoreContextType | null>(null);

function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(() => loadState("store-settings", defaultSettings));
  const [products, setProducts] = useState<Product[]>(() => loadState("store-products", defaultProducts));
  const [categories, setCategories] = useState<Category[]>(() => loadState("store-categories", defaultCategories));
  const [orders, setOrders] = useState<Order[]>(() => loadState("store-orders", defaultOrders));
  const [visitors] = useState<Visitor[]>(() => loadState("store-visitors", defaultVisitors));
  const [banners, setBanners] = useState<Banner[]>(() => loadState("store-banners", defaultBanners));

  useEffect(() => { localStorage.setItem("store-settings", JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem("store-products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("store-categories", JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem("store-orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("store-banners", JSON.stringify(banners)); }, [banners]);

  // Apply theme on mount
  useEffect(() => {
    if (settings.themeColors) applyThemeColors(settings.themeColors);
  }, []);

  const updateSettings = async (s: Partial<StoreSettings>) => {
    const newSettings = { ...settings, ...s };
    if (s.logo && s.logo !== settings.logo) {
      const colors = await extractColorsFromImage(s.logo);
      newSettings.themeColors = colors;
      applyThemeColors(colors);
    }
    setSettings(newSettings);
  };

  const addProduct = (p: Product) => setProducts(prev => [...prev, p]);
  const updateProduct = (id: string, p: Partial<Product>) =>
    setProducts(prev => prev.map(item => item.id === id ? { ...item, ...p } : item));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  const addCategory = (c: Category) => setCategories(prev => [...prev, c]);
  const updateCategory = (id: string, c: Partial<Category>) =>
    setCategories(prev => prev.map(item => item.id === id ? { ...item, ...c } : item));
  const deleteCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));

  const updateOrderStatus = (id: string, status: Order["status"]) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  const addOrder: StoreContextType["addOrder"] = (data) => {
    const seq = String(orders.length + 1).padStart(3, "0");
    const newOrder: Order = {
      id: `ORD-${seq}`,
      date: new Date().toISOString().slice(0, 10),
      status: data.status ?? "pending",
      customer: data.customer,
      email: data.email,
      items: data.items,
      total: data.total,
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const addBanner = (b: Banner) => setBanners(prev => [...prev, b]);
  const updateBanner = (id: string, b: Partial<Banner>) =>
    setBanners(prev => prev.map(item => item.id === id ? { ...item, ...b } : item));
  const deleteBanner = (id: string) => setBanners(prev => prev.filter(b => b.id !== id));

  return (
    <StoreContext.Provider value={{
      settings, updateSettings,
      products, addProduct, updateProduct, deleteProduct,
      categories, addCategory, updateCategory, deleteCategory,
      orders, updateOrderStatus,
      visitors,
      banners, addBanner, updateBanner, deleteBanner,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

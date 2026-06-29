import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, useStore, Coupon as StoreCoupon } from "./StoreContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

export type AppliedCoupon = StoreCoupon;

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  finalPrice: number;
}

const CartContext = createContext<CartContextType | null>(null);

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem("store-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { coupons } = useStore();
  const [items, setItems] = useState<CartItem[]>(() => loadCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    localStorage.setItem("store-cart", JSON.stringify(items));
  }, [items]);

  // Keep applied coupon in sync with admin updates (e.g. deactivation/deletion)
  useEffect(() => {
    if (!appliedCoupon) return;
    const fresh = coupons.find((c) => c.id === appliedCoupon.id);
    if (!fresh || !fresh.active) {
      setAppliedCoupon(null);
    } else if (
      fresh.value !== appliedCoupon.value ||
      fresh.discountType !== appliedCoupon.discountType ||
      fresh.code !== appliedCoupon.code
    ) {
      setAppliedCoupon(fresh);
    }
  }, [coupons, appliedCoupon]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupon = coupons.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (!coupon) {
      return { success: false, message: "Invalid coupon code" };
    }
    if (!coupon.active) {
      return { success: false, message: "This coupon is no longer active" };
    }
    if (appliedCoupon?.code === coupon.code) {
      return { success: false, message: "Coupon already applied" };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: `${coupon.label} applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discountAmount = (totalPrice * appliedCoupon.value) / 100;
    } else {
      discountAmount = Math.min(appliedCoupon.value, totalPrice);
    }
  }
  const finalPrice = Math.max(0, totalPrice - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        finalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// Backwards compatibility for any imports of Coupon from CartContext
export type Coupon = AppliedCoupon;

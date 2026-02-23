import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

export type CartOptions = {
  color: string;
  model?: string;
};

export type CartItem = {
  cartItemId: string; // unique per product+options
  productId: string;
  title: string;
  price: number;
  image: string;
  options: CartOptions;
  qty: number;
};

type AddToCartPayload = {
  productId: string;
  title: string;
  price: number;
  image: string;
  options: CartOptions;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (payload: AddToCartPayload) => void;
  removeFromCart: (cartItemId: string) => void;
  changeQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "fixonwheels_cart";

function makeCartItemId(productId: string, options: CartOptions) {
  const c = options.color ?? "";
  const m = options.model ?? "";
  return `${productId}__c:${c}__m:${m}`;
}

function loadCartFromStorage(): CartItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ✅ load cart once on app start
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  // ✅ save cart whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const addToCart = (payload: AddToCartPayload) => {
    const cartItemId = makeCartItemId(payload.productId, payload.options);

    setItems((prev) => {
      const existing = prev.find((x) => x.cartItemId === cartItemId);
      if (existing) {
        return prev.map((x) =>
          x.cartItemId === cartItemId ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          productId: payload.productId,
          title: payload.title,
          price: payload.price,
          image: payload.image,
          options: payload.options,
          qty: 1,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((x) => x.cartItemId !== cartItemId));
  };

  const changeQty = (cartItemId: string, qty: number) => {
    const safe = Math.max(1, Math.min(99, qty));
    setItems((prev) =>
      prev.map((x) => (x.cartItemId === cartItemId ? { ...x, qty: safe } : x))
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const totalCount = useMemo(
    () => items.reduce((sum, x) => sum + x.qty, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.qty, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        changeQty,
        clearCart,
        totalCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
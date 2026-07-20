import { create } from "zustand";
import type { CctvProduct } from "./cctv-store";

export type AppView =
  | "home" | "products" | "product-detail" | "cart" | "checkout"
  | "login" | "signup" | "dashboard" | "about" | "contact"
  | "builder" | "learn" | "compare" | "admin" | "detail";

export interface CartItem {
  productId: string;
  brand: string;
  modelName: string;
  cameraType: string;
  resolution: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  quantity: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface AppState {
  view: AppView;
  cart: CartItem[];
  user: UserProfile | null;
  userToken: string | null;
  mobileMenuOpen: boolean;
  searchQuery: string;

  setView: (v: AppView) => void;

  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  get cartTotal(): number;
  get cartCount(): number;

  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string; phone: string }) => Promise<boolean>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  get isAuthenticated(): boolean;

  toggleMobileMenu: () => void;
  setSearchQuery: (q: string) => void;
}

const isBrowser = typeof window !== "undefined";

export const useAppStore = create<AppState>((set, get) => ({
  view: "home",
  cart: isBrowser ? JSON.parse(localStorage.getItem("connectz_cart") || "[]") : [],
  user: isBrowser ? JSON.parse(localStorage.getItem("connectz_user") || "null") : null,
  userToken: isBrowser ? localStorage.getItem("connectz_token") : null,
  mobileMenuOpen: false,
  searchQuery: "",

  setView: (v) => set({ view: v }),

  addToCart: (item) => {
    const qty = item.quantity || 1;
    set((s) => {
      const existing = s.cart.find((c) => c.productId === item.productId);
      let newCart: CartItem[];
      if (existing) {
        newCart = s.cart.map((c) =>
          c.productId === item.productId ? { ...c, quantity: c.quantity + qty } : c
        );
      } else {
        newCart = [...s.cart, { ...item, quantity: qty }];
      }
      if (isBrowser) localStorage.setItem("connectz_cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  removeFromCart: (productId) => {
    set((s) => {
      const newCart = s.cart.filter((c) => c.productId !== productId);
      if (isBrowser) localStorage.setItem("connectz_cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  updateQuantity: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((s) => {
      const newCart = s.cart.map((c) =>
        c.productId === productId ? { ...c, quantity: qty } : c
      );
      if (isBrowser) localStorage.setItem("connectz_cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
  },

  clearCart: () => {
    if (isBrowser) localStorage.removeItem("connectz_cart");
    set({ cart: [] });
  },

  get cartTotal() {
    return get().cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  },

  get cartCount() {
    return get().cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  login: async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const user: UserProfile = { id: data.user?.id || "1", name: data.user?.name || email.split("@")[0], email: data.user.email, phone: "" };
        if (isBrowser) {
          localStorage.setItem("connectz_token", data.token);
          localStorage.setItem("connectz_user", JSON.stringify(user));
        }
        set({ userToken: data.token, user });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  signup: async (data: { name: string; email: string; password: string; phone: string }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success && result.token) {
        const user: UserProfile = { id: result.user?.id || "1", name: data.name, email: data.email, phone: data.phone };
        if (isBrowser) {
          localStorage.setItem("connectz_token", result.token);
          localStorage.setItem("connectz_user", JSON.stringify(user));
        }
        set({ userToken: result.token, user });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  logout: () => {
    if (isBrowser) {
      localStorage.removeItem("connectz_token");
      localStorage.removeItem("connectz_user");
    }
    set({ userToken: null, user: null, view: "home" });
  },

  restoreSession: async () => {
    const token = isBrowser ? localStorage.getItem("connectz_token") : null;
    const userStr = isBrowser ? localStorage.getItem("connectz_user") : null;
    if (!token || !userStr) return;
    try {
      const res = await fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.valid) {
        set({ userToken: token, user: JSON.parse(userStr) });
      } else {
        if (isBrowser) {
          localStorage.removeItem("connectz_token");
          localStorage.removeItem("connectz_user");
        }
      }
    } catch {
      // Network error — keep local state for offline
    }
  },

  get isAuthenticated() {
    return !!get().userToken && !!get().user;
  },

  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
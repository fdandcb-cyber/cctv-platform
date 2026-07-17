import { create } from "zustand";

export interface CctvProduct {
  id: string;
  brand: string;
  modelName: string;
  cameraType: string;
  resolution: string;
  technology: string;
  recorderType: string;
  nightVision: string;
  weatherRating: string;
  price: number;
  salePrice: number | null;
  description: string;
  features: string;
  imageUrl: string;
  videoUrl: string | null;
  sampleVideoUrl: string | null;
  irRange: string;
  fieldOfView: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreState {
  view: "catalog" | "detail" | "admin" | "compare" | "learn";
  learnSection: string;
  products: CctvProduct[];
  selectedProduct: CctvProduct | null;
  compareList: CctvProduct[];
  filters: {
    brand: string;
    cameraType: string;
    recorderType: string;
    search: string;
    sortBy: string;
    maxPrice: string;
  };
  loading: boolean;
  setView: (v: StoreState["view"]) => void;
  setLearnSection: (s: string) => void;
  setProducts: (p: CctvProduct[]) => void;
  setSelectedProduct: (p: CctvProduct | null) => void;
  toggleCompare: (p: CctvProduct) => void;
  clearCompare: () => void;
  setFilter: (k: keyof StoreState["filters"], v: string) => void;
  setLoading: (l: boolean) => void;
}

export const useStore = create<StoreState>((set) => ({
  view: "catalog",
  learnSection: "overview",
  products: [],
  selectedProduct: null,
  compareList: [],
  filters: { brand: "all", cameraType: "all", recorderType: "all", search: "", sortBy: "price", maxPrice: "" },
  loading: false,
  setView: (v) => set({ view: v }),
  setLearnSection: (s) => set({ learnSection: s }),
  setProducts: (p) => set({ products: p }),
  setSelectedProduct: (p) => set({ selectedProduct: p, view: p ? "detail" : "catalog" }),
  toggleCompare: (p) =>
    set((s) => {
      const exists = s.compareList.find((c) => c.id === p.id);
      if (exists) return { compareList: s.compareList.filter((c) => c.id !== p.id) };
      if (s.compareList.length >= 4) return s;
      return { compareList: [...s.compareList, p] };
    }),
  clearCompare: () => set({ compareList: [] }),
  setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
  setLoading: (l) => set({ loading: l }),
}));
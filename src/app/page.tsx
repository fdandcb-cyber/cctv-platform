"use client";

import { useEffect, useCallback } from "react";
import { useStore, type CctvProduct } from "@/store/cctv-store";
import { useAppStore } from "@/store/app-store";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { HomePage } from "@/components/pages/home-page";
import { ProductsPage } from "@/components/pages/products-page";
import { ProductDetailPage } from "@/components/pages/product-detail-page";
import { CartPage } from "@/components/pages/cart-page";
import { CheckoutPage } from "@/components/pages/checkout-page";
import { AuthPage } from "@/components/pages/auth-page";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { AboutPage } from "@/components/pages/about-page";
import { ContactPage } from "@/components/pages/contact-page";
import { LearningSystem } from "@/components/learning-system";
import { CctvBuilder } from "@/components/cctv-builder";
import { AdminPanel } from "@/components/admin-panel";
import { AdminLogin } from "@/components/admin-login";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Camera, GitCompareArrows,
  Shield, LogOut, Eye,
  GraduationCap, Wrench, Star, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// ─── Legacy Product Card (for compare/detail views) ───
const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Dome: { icon: <Camera className="h-4 w-4" />, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  Bullet: { icon: <Camera className="h-4 w-4" />, color: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
  WiFi: { icon: <Camera className="h-4 w-4" />, color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  PTZ: { icon: <Camera className="h-4 w-4" />, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  "4G": { icon: <Camera className="h-4 w-4" />, color: "text-red-700", bg: "bg-red-50 border-red-200" },
  DVR: { icon: <Play className="h-4 w-4" />, color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
  NVR: { icon: <Play className="h-4 w-4" />, color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
};

function LegacyProductDetail({ product, onBack }: { product: CctvProduct; onBack: () => void }) {
  const cfg = typeConfig[product.cameraType] || typeConfig.Bullet;
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1"><Eye className="h-4 w-4" /> Back</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cn("aspect-square rounded-xl border-2 flex items-center justify-center p-8", cfg.bg)}>
          {product.imageUrl ? <img src={product.imageUrl} alt={product.modelName} className="max-h-full object-contain" /> : <Camera className="h-16 w-16 text-muted-foreground" />}
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn(cfg.color, cfg.bg)}>{cfg.icon}{product.cameraType}</Badge>
            <Badge variant="outline">{product.resolution}</Badge>
            <Badge variant="outline">{product.technology}</Badge>
          </div>
          <h1 className="text-2xl font-bold">{product.brand} {product.modelName}</h1>
          <p className="text-muted-foreground">{product.description}</p>
          <div className="flex items-end gap-3">
            {product.salePrice && product.salePrice < product.price ? (
              <div><span className="text-3xl font-bold text-emerald-600">{fmt(product.salePrice)}</span><span className="text-lg text-muted-foreground line-through ml-2">{fmt(product.price)}</span></div>
            ) : <span className="text-3xl font-bold">{fmt(product.price)}</span>}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {product.nightVision && <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Night Vision</p><p className="font-medium">{product.nightVision}</p></div>}
            {product.weatherRating && <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Weather</p><p className="font-medium">{product.weatherRating}</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function LegacyCompareView({ onBack }: { onBack: () => void }) {
  const { compareList, toggleCompare } = useStore();
  if (compareList.length === 0) return (
    <div className="text-center py-16"><GitCompareArrows className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><h3 className="text-lg font-semibold">No products to compare</h3><Button className="mt-4" onClick={onBack}>Browse Products</Button></div>
  );
  const fields = ["brand", "modelName", "cameraType", "resolution", "technology", "price", "salePrice"];
  const labels: Record<string, string> = { brand: "Brand", modelName: "Model", cameraType: "Type", resolution: "Resolution", technology: "Technology", price: "Price", salePrice: "Sale Price" };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Compare ({compareList.length}/4)</h2><Button variant="outline" size="sm" onClick={onBack}>Back</Button></div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead><tr><th className="p-3 text-left bg-muted">Feature</th>{compareList.map((p) => <th key={p.id} className="p-3 text-center bg-muted">{p.brand}<br /><span className="text-xs font-normal">{p.modelName}</span></th>)}</tr></thead>
          <tbody>
            {fields.map((f) => (<tr key={f} className="border-t"><td className="p-3 font-medium bg-muted/50">{labels[f]}</td>{compareList.map((p) => <td key={p.id} className="p-3 text-center">{(f === "price" || f === "salePrice") ? (p[f as keyof CctvProduct] ? fmt(p[f as keyof CctvProduct] as number) : "-") : (p[f as keyof CctvProduct] as string) || "-"}</td>)}</tr>))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════

export default function Home() {
  const { products, filters, setProducts, loading, setLoading, selectedProduct, setSelectedProduct } = useStore();
  const { view, setView, restoreSession, mobileMenuOpen, toggleMobileMenu } = useAppStore();
  const [adminAuth, setAdminAuth] = useState<{ token: string; user: { email: string; role: string } } | null>(null);

  // Restore auth session
  useEffect(() => {
    restoreSession();
    // Also restore admin session from old keys
    const token = localStorage.getItem("admin_token");
    const userStr = localStorage.getItem("admin_user");
    if (token && userStr) {
      fetch("/api/auth/verify", { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((d) => { if (d.valid) setAdminAuth({ token, user: JSON.parse(userStr) }); })
        .catch(() => {});
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.brand && filters.brand !== "all") params.set("brand", filters.brand);
    if (filters.cameraType && filters.cameraType !== "all") params.set("cameraType", filters.cameraType);
    if (filters.recorderType && filters.recorderType !== "all") params.set("recorderType", filters.recorderType);
    if (filters.search) params.set("search", filters.search);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sortBy) {
      if (filters.sortBy === "price_desc") { params.set("sortBy", "price"); params.set("order", "desc"); }
      else { params.set("sortBy", filters.sortBy); }
    }
    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch {}
    setLoading(false);
  }, [filters, setProducts, setLoading]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Close mobile menu on view change
  useEffect(() => { if (mobileMenuOpen) toggleMobileMenu(); }, [view]);

  function handleAdminLogin(token: string, user: { email: string; role: string }) {
    setAdminAuth({ token, user });
  }

  function handleAdminLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setAdminAuth(null);
    setView("home");
    toast.success("Logged out");
  }

  // Page transition wrapper
  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  function renderView() {
    switch (view) {
      case "home": return <HomePage />;
      case "products": return <ProductsPage />;
      case "product-detail": return <ProductDetailPage />;
      case "cart": return <CartPage />;
      case "checkout": return <CheckoutPage />;
      case "login": return <AuthPage />;
      case "signup": return <AuthPage />;
      case "dashboard": return <DashboardPage />;
      case "about": return <AboutPage />;
      case "contact": return <ContactPage />;
      case "builder": return <CctvBuilder />;
      case "learn": return <LearningSystem />;
      case "admin":
        return adminAuth ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                <Shield className="h-3 w-3 mr-1" /> {adminAuth.user.email}
              </Badge>
              <Button variant="ghost" size="sm" className="gap-1 text-red-500" onClick={handleAdminLogout}>
                <LogOut className="h-3.5 w-3.5" /> Logout
              </Button>
            </div>
            <AdminPanel onBack={() => setView("home")} />
          </div>
        ) : <AdminLogin onLogin={handleAdminLogin} onBack={() => setView("home")} />;
      case "detail":
        return selectedProduct ? <LegacyProductDetail product={selectedProduct} onBack={() => setView("products")} /> : <ProductsPage />;
      case "compare":
        return <LegacyCompareView onBack={() => setView("products")} />;
      default: return <HomePage />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1" role="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter />
    </div>
  );
}
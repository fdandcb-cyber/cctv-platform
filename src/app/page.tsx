"use client";

import { useEffect, useCallback } from "react";
import { useStore, type CctvProduct } from "@/store/cctv-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LearningSystem } from "@/components/learning-system";
import { CctvBuilder } from "@/components/cctv-builder";
import { AdminPanel } from "@/components/admin-panel";
import { cn } from "@/lib/utils";
import {
  Search, Shield, Eye, GitCompareArrows, X,
  Camera, Wifi, Radio, Signal, MonitorPlay,
  Tag, DollarSign, Star,
  GraduationCap, Wrench, Play,
} from "lucide-react";
import { toast } from "sonner";

// ─── Camera type icons/colors ───
const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Dome: { icon: <Camera className="h-4 w-4" />, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  Bullet: { icon: <Camera className="h-4 w-4" />, color: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
  WiFi: { icon: <Wifi className="h-4 w-4" />, color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  PTZ: { icon: <Radio className="h-4 w-4" />, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  "4G": { icon: <Signal className="h-4 w-4" />, color: "text-red-700", bg: "bg-red-50 border-red-200" },
  DVR: { icon: <MonitorPlay className="h-4 w-4" />, color: "text-slate-700", bg: "bg-slate-50 border-slate-200" },
  NVR: { icon: <MonitorPlay className="h-4 w-4" />, color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
};

// ─── Price formatter ───
const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

// ═══════════════════════════════════════════
// Product Card
// ═══════════════════════════════════════════

function ProductCard({ p }: { p: CctvProduct }) {
  const { setView, setSelectedProduct, compareList, toggleCompare } = useStore();
  const isCompared = compareList.some((c) => c.id === p.id);
  const cfg = typeConfig[p.cameraType] || typeConfig.Bullet;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className={cn("aspect-[4/3] bg-muted relative overflow-hidden cursor-pointer", cfg.bg)} onClick={() => { setSelectedProduct(p); setView("detail"); }}>
        {p.imageUrl && <img src={p.imageUrl} alt={p.modelName} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
        {p.salePrice && p.salePrice < p.price && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px]">
            {Math.round(((p.price - p.salePrice) / p.price) * 100)}% OFF
          </Badge>
        )}
        {p.videoUrl && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-4 w-4" />
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className={cn("text-[10px]", cfg.color, cfg.bg)}>{cfg.icon}{p.cameraType}</Badge>
          <Badge variant="outline" className="text-[10px]">{p.resolution}</Badge>
        </div>
        <p className="font-semibold text-sm">{p.brand}</p>
        <p className="text-xs text-muted-foreground">{p.modelName}</p>
        <div className="flex items-end justify-between">
          <div>
            {p.salePrice && p.salePrice < p.price ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-emerald-600">{fmt(p.salePrice)}</span>
                <span className="text-xs text-muted-foreground line-through">{fmt(p.price)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold">{fmt(p.price)}</span>
            )}
          </div>
          <Button
            size="sm"
            variant={isCompared ? "default" : "outline"}
            className="text-xs h-8"
            onClick={() => toggleCompare(p)}
            disabled={!isCompared && compareList.length >= 4}
          >
            <GitCompareArrows className="h-3 w-3 mr-1" />
            {isCompared ? "Added" : "Compare"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════
// Product Detail
// ═══════════════════════════════════════════

function ProductDetail({ product, onBack }: { product: CctvProduct; onBack: () => void }) {
  const { compareList, toggleCompare } = useStore();
  const isCompared = compareList.some((c) => c.id === product.id);
  const cfg = typeConfig[product.cameraType] || typeConfig.Bullet;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-1"><Eye className="h-4 w-4" /> Back to Catalog</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cn("aspect-square rounded-xl border-2 flex items-center justify-center p-8", cfg.bg)}>
          {product.imageUrl ? <img src={product.imageUrl} alt={product.modelName} className="max-h-full object-contain" /> : <Camera className="h-16 w-16 text-muted-foreground" />}
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={cn(cfg.color, cfg.bg)}>{cfg.icon}{product.cameraType}</Badge>
              <Badge variant="outline">{product.resolution}</Badge>
              <Badge variant="outline">{product.technology}</Badge>
            </div>
            <h1 className="text-2xl font-bold">{product.brand} {product.modelName}</h1>
            <p className="text-muted-foreground mt-1">{product.description}</p>
          </div>
          <div className="flex items-end gap-3">
            {product.salePrice && product.salePrice < product.price ? (
              <div>
                <span className="text-3xl font-bold text-emerald-600">{fmt(product.salePrice)}</span>
                <span className="text-lg text-muted-foreground line-through ml-2">{fmt(product.price)}</span>
                <Badge className="ml-2 bg-red-500 text-white">Save {fmt(product.price - product.salePrice)}</Badge>
              </div>
            ) : (
              <span className="text-3xl font-bold">{fmt(product.price)}</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {product.nightVision && <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Night Vision</p><p className="font-medium">{product.nightVision}</p></div>}
            {product.weatherRating && <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Weather</p><p className="font-medium">{product.weatherRating}</p></div>}
            {product.irRange && <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">IR Range</p><p className="font-medium">{product.irRange}</p></div>}
            {product.fieldOfView && <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Field of View</p><p className="font-medium">{product.fieldOfView}</p></div>}
            <div className="bg-muted/50 rounded-lg p-3"><p className="text-xs text-muted-foreground">Recorder</p><p className="font-medium">{product.recorderType}</p></div>
          </div>
          {product.features && (Array.isArray(product.features) ? product.features : product.features.split(",").map((s: string) => s.trim()).filter(Boolean)).length > 0 && (
            <div className="flex flex-wrap gap-1.5">{(Array.isArray(product.features) ? product.features : product.features.split(",").map((s: string) => s.trim()).filter(Boolean)).map((f: string) => <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>)}</div>
          )}
          <Button className="gap-2" disabled={isCompared || compareList.length >= 4} onClick={() => { toggleCompare(product); toast.success("Added to compare!"); }}>
            <GitCompareArrows className="h-4 w-4" /> {isCompared ? "In Compare List" : "Add to Compare"}
          </Button>
          {product.sampleVideoUrl && (
            <div className="rounded-xl overflow-hidden border aspect-video">
              <iframe src={product.sampleVideoUrl} className="w-full h-full" allowFullScreen title="Sample video" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Compare View
// ═══════════════════════════════════════════

function CompareView() {
  const { compareList, toggleCompare, setView } = useStore();

  if (compareList.length === 0) {
    return (
      <div className="text-center py-16">
        <GitCompareArrows className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-semibold">No products to compare</h3>
        <p className="text-muted-foreground text-sm">Add products from the catalog to compare them.</p>
        <Button className="mt-4" onClick={() => setView("catalog")}>Browse Catalog</Button>
      </div>
    );
  }

  const fields = ["brand", "modelName", "cameraType", "resolution", "technology", "recorderType", "nightVision", "weatherRating", "irRange", "fieldOfView", "price", "salePrice"];
  const labels: Record<string, string> = { brand: "Brand", modelName: "Model", cameraType: "Type", resolution: "Resolution", technology: "Technology", recorderType: "Recorder", nightVision: "Night Vision", weatherRating: "Weather", irRange: "IR Range", fieldOfView: "FOV", price: "Price", salePrice: "Sale Price" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Compare ({compareList.length}/4)</h2>
        <Button variant="outline" size="sm" onClick={() => setView("catalog")}>Back to Catalog</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead><tr><th className="p-3 text-left bg-muted min-w-[140px]">Feature</th>{compareList.map((p) => (<th key={p.id} className="p-3 text-center bg-muted min-w-[180px]">{p.brand}<br /><span className="text-xs font-normal">{p.modelName}</span></th>))}</tr></thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f} className="border-t">
                <td className="p-3 font-medium bg-muted/50">{labels[f]}</td>
                {compareList.map((p) => {
                  const val = p[f as keyof CctvProduct];
                  return (
                    <td key={p.id} className="p-3 text-center">
                      {f === "price" || f === "salePrice" ? (val ? fmt(val as number) : "-") : (val as string) || "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t"><td className="p-3 font-medium bg-muted/50">Actions</td>{compareList.map((p) => (<td key={p.id} className="p-3 text-center"><Button variant="ghost" size="sm" className="text-red-500" onClick={() => toggleCompare(p)}><X className="h-4 w-4" /></Button></td>))}</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Filter Sidebar
// ═══════════════════════════════════════════

function FilterSidebar() {
  const { filters, setFilter, products, compareList, setView } = useStore();
  const brands = [...new Set(products.map((p) => p.brand))].sort();
  const types = [...new Set(products.map((p) => p.cameraType))].sort();
  const recorders = [...new Set(products.map((p) => p.recorderType))].sort();

  return (
    <aside className="space-y-5 w-full lg:w-64 shrink-0">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Search</Label>
        <div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={filters.search} onChange={(e) => setFilter("search", e.target.value)} placeholder="Search brand or model..." className="pl-9" /></div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Brand</Label>
        <Select value={filters.brand} onValueChange={(v) => setFilter("brand", v)}>
          <SelectTrigger><SelectValue placeholder="All Brands" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Brands</SelectItem>{brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Camera Type</Label>
        <Select value={filters.cameraType} onValueChange={(v) => setFilter("cameraType", v)}>
          <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Types</SelectItem>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Recorder Type</Label>
        <Select value={filters.recorderType} onValueChange={(v) => setFilter("recorderType", v)}>
          <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All</SelectItem>{recorders.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Max Price (INR)</Label>
        <Input type="number" value={filters.maxPrice} onChange={(e) => setFilter("maxPrice", e.target.value)} placeholder="e.g. 10000" />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wide">Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(v) => setFilter("sortBy", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="createdAt">Newest First</SelectItem>
            <SelectItem value="brand">Brand A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {compareList.length > 0 && (
        <Button variant="outline" className="w-full gap-2" onClick={() => setView("compare")}>
          <GitCompareArrows className="h-4 w-4" /> Compare ({compareList.length})
        </Button>
      )}
    </aside>
  );
}

// ═══════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════

export default function Home() {
  const { view, products, filters, setFilter, setProducts, loading, setLoading, setView, setLearnSection, setSelectedProduct } = useStore();

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
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    if (data.success) setProducts(data.data);
    setLoading(false);
  }, [filters, setProducts, setLoading]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => setView("catalog")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Shield className="h-6 w-6 text-emerald-600" />
              <span className="font-bold text-lg hidden sm:inline">CCTV Catalog</span>
            </button>
            <div className="flex items-center gap-2">
              <Tabs value={view} onValueChange={(v) => { if (v === "learn") setLearnSection("overview"); setView(v as typeof view); }}>
                <TabsList className="h-9">
                  <TabsTrigger value="builder" className="text-xs px-3 gap-1"><Wrench className="h-3.5 w-3.5 hidden sm:inline" />Builder</TabsTrigger>
                  <TabsTrigger value="catalog" className="text-xs px-3 gap-1"><Camera className="h-3.5 w-3.5 hidden sm:inline" />Catalog</TabsTrigger>
                  <TabsTrigger value="learn" className="text-xs px-3 gap-1"><GraduationCap className="h-3.5 w-3.5 hidden sm:inline" />Learn</TabsTrigger>
                  <TabsTrigger value="compare" className="text-xs px-3 gap-1"><GitCompareArrows className="h-3.5 w-3.5 hidden sm:inline" />Compare</TabsTrigger>
                  <TabsTrigger value="admin" className="text-xs px-3 gap-1"><Star className="h-3.5 w-3.5 hidden sm:inline" />Admin</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {view === "builder" ? (
          <CctvBuilder />
        ) : view === "learn" ? (
          <LearningSystem />
        ) : view === "detail" && useStore.getState().selectedProduct ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ProductDetail product={useStore.getState().selectedProduct!} onBack={() => setView("catalog")} />
          </div>
        ) : view === "compare" ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CompareView />
          </div>
        ) : view === "admin" ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AdminPanel onBack={() => setView("catalog")} />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Hero Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: <Camera className="h-5 w-5" />, label: "Products", value: products.length, color: "text-emerald-600" },
                { icon: <Star className="h-5 w-5" />, label: "Brands", value: [...new Set(products.map((p) => p.brand))].length, color: "text-amber-600" },
                { icon: <Tag className="h-5 w-5" />, label: "On Sale", value: products.filter((p) => p.salePrice).length, color: "text-red-600" },
                { icon: <DollarSign className="h-5 w-5" />, label: "Under 5K", value: products.filter((p) => p.price < 5000).length, color: "text-sky-600" },
              ].map((s) => (
                <Card key={s.label} className="flex items-center gap-3 p-3">
                  <div className={cn(s.color)}>{s.icon}</div>
                  <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
                </Card>
              ))}
            </div>

            {/* Camera Type Quick Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {["all", "Dome", "Bullet", "WiFi", "PTZ", "4G", "DVR", "NVR"].map((t) => {
                const active = filters.cameraType === t;
                const cfg = typeConfig[t];
                return (
                  <Button key={t} variant={active ? "default" : "outline"} size="sm" className="gap-1.5 text-xs" onClick={() => setFilter("cameraType", t)}>
                    {cfg?.icon || <Camera className="h-3.5 w-3.5" />}
                    {t === "all" ? "All Types" : t}
                  </Button>
                );
              })}
            </div>

            {/* Filters + Grid */}
            <div className="flex flex-col lg:flex-row gap-6">
              <FilterSidebar />
              <div className="flex-1">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="overflow-hidden"><div className="aspect-[4/3] bg-muted animate-pulse" /><div className="p-4 space-y-2"><div className="h-3 bg-muted rounded animate-pulse w-20" /><div className="h-4 bg-muted rounded animate-pulse w-32" /><div className="h-3 bg-muted rounded animate-pulse w-16" /></div></Card>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-16">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-semibold">No products found</h3>
                    <p className="text-muted-foreground text-sm">Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">{products.length} product{products.length !== 1 ? "s" : ""} found</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {products.map((p) => (
                        <ProductCard key={p.id} p={p} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>CCTV Product Catalog Platform — Manage and compare security camera systems</p>
          <p>Supports Hikvision, Dahua, and more</p>
        </div>
      </footer>
    </div>
  );
}
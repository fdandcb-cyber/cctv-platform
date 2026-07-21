"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/app-store";
import { useStore, type CctvProduct } from "@/store/cctv-store";
import {
  Search,
  Camera,
  Wifi,
  Radio,
  Signal,
  MonitorPlay,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  PackageX,
  X,
  Heart,
  GitCompareArrows,
  ShieldCheck,
  Award,
  Truck,
  CreditCard,
  Phone,
  MessageCircle,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Home,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Price formatter ───
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Type config ───
const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Dome: { icon: <Camera className="h-4 w-4" />, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800" },
  Bullet: { icon: <Camera className="h-4 w-4" />, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800" },
  WiFi: { icon: <Wifi className="h-4 w-4" />, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800" },
  PTZ: { icon: <Radio className="h-4 w-4" />, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800" },
  "4G": { icon: <Signal className="h-4 w-4" />, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800" },
  DVR: { icon: <MonitorPlay className="h-4 w-4" />, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700" },
  NVR: { icon: <MonitorPlay className="h-4 w-4" />, color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800" },
};

const quickTypes = ["all", "Dome", "Bullet", "WiFi", "PTZ", "4G", "DVR", "NVR"];
const ITEMS_PER_PAGE = 12;

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "100% Genuine Products", desc: "All products sourced from authorized channels" },
  { icon: Award, label: "Manufacturer Warranty", desc: "Full warranty on every product" },
  { icon: Truck, label: "Fast Delivery", desc: "Reliable shipping across India" },
  { icon: CreditCard, label: "Secure Payments", desc: "Protected by Razorpay" },
];

// ─── Animation variants ───
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" } as const,
  transition: { duration: 0.45, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.06 } },
  viewport: { once: true, margin: "-40px" } as const,
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

// ═══════════════════════════════════════════════════════════════
// PRODUCT CARD
// ═══════════════════════════════════════════════════════════════

function ProductCard({ p, index }: { p: CctvProduct; index: number }) {
  const { addToCart } = useAppStore();
  const router = useRouter();
  const { compareList, toggleCompare } = useStore();
  const [liked, setLiked] = useState(false);
  const cfg = typeConfig[p.cameraType] || typeConfig.Bullet;
  const isCompared = compareList.some((c) => c.id === p.id);

  const discountPercent = useMemo(() => {
    if (p.salePrice && p.salePrice < p.price) {
      return Math.round(((p.price - p.salePrice) / p.price) * 100);
    }
    return 0;
  }, [p.price, p.salePrice]);

  const savings = p.salePrice && p.salePrice < p.price ? p.price - p.salePrice : 0;

  const specs = [p.resolution, p.nightVision, p.weatherRating].filter(Boolean);

  const handleAddToCart = () => {
    addToCart({
      productId: p.id,
      brand: p.brand,
      modelName: p.modelName,
      cameraType: p.cameraType,
      resolution: p.resolution,
      price: p.price,
      salePrice: p.salePrice,
      imageUrl: p.imageUrl,
      quantity: 1,
    });
    toast.success("Added to cart!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="h-full"
    >
      <Card
        className={cn(
          "h-full overflow-hidden rounded-2xl py-0 gap-0 group",
          "border border-border/60 shadow-sm",
          "hover:shadow-xl hover:-translate-y-1",
          "transition-all duration-300 ease-out",
          "hover:border-emerald-500/50"
        )}
      >
        {/* ── Image area ── */}
        <div
          className={cn(
            "aspect-[4/3] bg-muted/50 relative overflow-hidden cursor-pointer"
          )}
          onClick={() => router.push(`/products/${p.id}`)}
        >
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={p.modelName}
              className={cn(
                "w-full h-full object-contain p-5",
                "group-hover:scale-105 transition-transform duration-500"
              )}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="h-14 w-14 text-muted-foreground/20" />
            </div>
          )}

          {/* Top left: discount badge */}
          {discountPercent > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg shadow-sm">
              {discountPercent}% OFF
            </Badge>
          )}

          {/* Top right: action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                "bg-background/90 backdrop-blur-sm border border-border/50 shadow-sm",
                "transition-all duration-200 hover:scale-110",
                liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleCompare(p); }}
              aria-label={isCompared ? "Remove from compare" : "Add to compare"}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                "bg-background/90 backdrop-blur-sm border border-border/50 shadow-sm",
                "transition-all duration-200 hover:scale-110",
                isCompared ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground hover:text-emerald-600"
              )}
            >
              <GitCompareArrows className="h-4 w-4" />
            </button>
          </div>

          {/* Brand badge overlay */}
          <Badge
            variant="outline"
            className="absolute bottom-3 left-3 text-[10px] bg-background/80 backdrop-blur-sm font-medium"
          >
            {p.brand}
          </Badge>
        </div>

        {/* ── Body ── */}
        <CardContent className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
          {/* Type + Resolution chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="outline"
              className={cn("text-[10px] font-medium", cfg.color, cfg.bg)}
            >
              {cfg.icon}
              {p.cameraType}
            </Badge>
            {p.resolution && (
              <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                {p.resolution}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className="font-semibold text-base leading-snug line-clamp-2 cursor-pointer hover:text-emerald-600 transition-colors"
            onClick={() => router.push(`/products/${p.id}`)}
          >
            {p.modelName}
          </h3>

          {/* Spec chips */}
          {specs.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {specs.map((spec, i) => (
                <span
                  key={`${spec}-${i}`}
                  className="text-[10px] text-muted-foreground bg-muted/40 border border-border/30 px-2 py-0.5 rounded-md"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* In stock indicator */}
          <div className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", "bg-emerald-500")} />
            <span className="text-xs text-muted-foreground">In Stock</span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-1">
            {discountPercent > 0 ? (
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-emerald-600">
                    {fmt(p.salePrice!)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {fmt(p.price)}
                  </span>
                </div>
                <span className="text-xs text-emerald-600 font-medium">
                  You save {fmt(savings)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-bold">{fmt(p.price)}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              className={cn(
                "flex-1 gap-2 rounded-xl text-sm h-10",
                "bg-emerald-600 text-white hover:bg-emerald-700",
                "shadow-sm shadow-emerald-600/20",
                "transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              )}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="rounded-xl text-sm h-10 px-3 transition-all duration-200 hover:scale-[1.02]"
              onClick={() => router.push(`/products/${p.id}`)}
              aria-label="View details"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════════════════════════

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden rounded-2xl py-0 gap-0">
          <div className="aspect-[4/3] bg-muted animate-pulse" />
          <CardContent className="p-4 sm:p-5 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-12 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="h-4 bg-muted rounded-md animate-pulse w-3/4" />
            <div className="h-4 bg-muted rounded-md animate-pulse w-1/2" />
            <div className="h-6 bg-muted rounded-md animate-pulse w-24 mt-2" />
            <div className="flex gap-2 pt-1">
              <div className="h-10 flex-1 bg-muted rounded-xl animate-pulse" />
              <div className="h-10 w-10 bg-muted rounded-xl animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FILTER SIDEBAR (Desktop)
// ═══════════════════════════════════════════════════════════════

function FilterSidebar({ filters, setFilter, resetFilters }: {
  filters: Record<string, string>;
  setFilter: (k: string, v: string) => void;
  resetFilters: () => void;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brand: true,
    type: true,
    price: true,
    sort: true,
  });

  const toggleSection = (s: string) =>
    setOpenSections((prev) => ({ ...prev, [s]: !prev[s] }));

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm">Filters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-7 px-2"
            onClick={resetFilters}
          >
            Reset
          </Button>
        </div>

        {/* Brand */}
        <FilterSection title="Brand" open={openSections.brand} onToggle={() => toggleSection("brand")}>
          <Select
            value={filters.brand}
            onValueChange={(v) => setFilter("brand", v)}
          >
            <SelectTrigger className="w-full rounded-xl h-10">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="Hikvision">Hikvision</SelectItem>
              <SelectItem value="Dahua">Dahua</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        {/* Camera Type */}
        <FilterSection title="Camera Type" open={openSections.type} onToggle={() => toggleSection("type")}>
          <div className="grid grid-cols-2 gap-2">
            {quickTypes.filter((t) => t !== "all").map((t) => {
              const cfg = typeConfig[t];
              const active = filters.cameraType === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilter("cameraType", active ? "all" : t)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                    active
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 border border-emerald-600"
                      : "bg-muted/50 border border-border/60 text-muted-foreground hover:border-emerald-500/50 hover:text-foreground"
                  )}
                >
                  {cfg?.icon}
                  {t}
                </button>
              );
            })}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range" open={openSections.price} onToggle={() => toggleSection("price")}>
          <Select
            value={filters.maxPrice || "all"}
            onValueChange={(v) => setFilter("maxPrice", v === "all" ? "" : v)}
          >
            <SelectTrigger className="w-full rounded-xl h-10">
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="3000">Under {fmt(3000)}</SelectItem>
              <SelectItem value="5000">Under {fmt(5000)}</SelectItem>
              <SelectItem value="10000">Under {fmt(10000)}</SelectItem>
              <SelectItem value="20000">Under {fmt(20000)}</SelectItem>
              <SelectItem value="50000">Under {fmt(50000)}</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        {/* Sort By */}
        <FilterSection title="Sort By" open={openSections.sort} onToggle={() => toggleSection("sort")}>
          <Select
            value={filters.sortBy}
            onValueChange={(v) => setFilter("sortBy", v)}
          >
            <SelectTrigger className="w-full rounded-xl h-10">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="createdAt">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>
      </div>
    </aside>
  );
}

function FilterSection({ title, open, onToggle, children }: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-sm font-medium group"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOBILE FILTER SHEET
// ═══════════════════════════════════════════════════════════════

function MobileFilterSheet({ filters, setFilter, resetFilters, open, onOpenChange }: {
  filters: Record<string, string>;
  setFilter: (k: string, v: string) => void;
  resetFilters: () => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 pb-8 space-y-6 pt-4">
          {/* Brand */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Brand</Label>
            <Select value={filters.brand} onValueChange={(v) => setFilter("brand", v)}>
              <SelectTrigger className="w-full rounded-xl h-11">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="Hikvision">Hikvision</SelectItem>
                <SelectItem value="Dahua">Dahua</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Camera Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Camera Type</Label>
            <div className="flex flex-wrap gap-2">
              {quickTypes.map((t) => {
                const cfg = typeConfig[t];
                const active = filters.cameraType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setFilter("cameraType", active ? "all" : t)}
                    className={cn(
                      "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200 border",
                      active
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-background border-border/60 text-muted-foreground hover:border-emerald-500/50"
                    )}
                  >
                    {cfg?.icon}
                    {t === "all" ? "All Types" : t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Price Range</Label>
            <Select value={filters.maxPrice || "all"} onValueChange={(v) => setFilter("maxPrice", v === "all" ? "" : v)}>
              <SelectTrigger className="w-full rounded-xl h-11">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="3000">Under {fmt(3000)}</SelectItem>
                <SelectItem value="5000">Under {fmt(5000)}</SelectItem>
                <SelectItem value="10000">Under {fmt(10000)}</SelectItem>
                <SelectItem value="20000">Under {fmt(20000)}</SelectItem>
                <SelectItem value="50000">Under {fmt(50000)}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(v) => setFilter("sortBy", v)}>
              <SelectTrigger className="w-full rounded-xl h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="createdAt">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-11"
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button
              className={cn(
                "flex-1 rounded-xl h-11",
                "bg-emerald-600 text-white hover:bg-emerald-700"
              )}
              onClick={() => onOpenChange(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPARE BAR
// ═══════════════════════════════════════════════════════════════

function CompareBar({ compareList, clearCompare, onGoToCompare }: {
  compareList: CctvProduct[];
  clearCompare: () => void;
  onGoToCompare: () => void;
}) {
  if (compareList.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      <Card className={cn(
        "py-0 gap-0 rounded-2xl shadow-2xl",
        "border border-emerald-500/30 bg-background/95 backdrop-blur-xl"
      )}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <GitCompareArrows className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium">{compareList.length} selected</span>
          </div>
          <div className="flex items-center gap-2">
            {compareList.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-2.5 py-1.5 text-xs"
              >
                <span className="font-medium truncate max-w-[100px]">{p.modelName}</span>
              </div>
            ))}
          </div>
          <Button
            size="sm"
            className={cn(
              "gap-1.5 rounded-xl",
              "bg-emerald-600 text-white hover:bg-emerald-700"
            )}
            onClick={onGoToCompare}
            disabled={compareList.length < 2}
          >
            Compare ({compareList.length})
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground rounded-lg"
            onClick={clearCompare}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TRUST SECTION
// ═══════════════════════════════════════════════════════════════

function TrustSection() {
  return (
    <section className="py-16 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div {...staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_ITEMS.map((item) => (
            <motion.div key={item.label} {...staggerItem}>
              <Card className={cn(
                "h-full py-0 gap-0 rounded-2xl border border-border/60 shadow-sm",
                "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              )}>
                <CardContent className="p-5 text-center space-y-3">
                  <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl mx-auto",
                    "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
                    "border border-emerald-100 dark:border-emerald-800/60"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONTACT CTA
// ═══════════════════════════════════════════════════════════════

function ContactCta() {
  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div {...fadeUp}>
          <div className={cn(
            "relative overflow-hidden rounded-3xl p-10 sm:p-14",
            "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800",
            "text-white"
          )}>
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center space-y-5 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Need help choosing the right setup?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Talk to a CCTV expert who can guide you through camera selection, compatibility, and pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <a
                  href="https://wa.me/917809465102"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl",
                    "bg-emerald-600 text-white hover:bg-emerald-700",
                    "shadow-lg shadow-emerald-600/20 font-medium",
                    "transition-all duration-300 hover:shadow-xl hover:scale-[1.03]"
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
                <a
                  href="tel:+917809465102"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl",
                    "border border-white/20 text-white hover:bg-white/10",
                    "font-medium transition-all duration-300"
                  )}
                >
                  <Phone className="h-5 w-5" />
                  Call Now
                </a>
                <Link
                  href="/builder"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl",
                    "border border-white/20 text-white hover:bg-white/10",
                    "font-medium transition-all duration-300"
                  )}
                >
                  <Wrench className="h-5 w-5" />
                  Build Your Setup
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PRODUCTS PAGE
// ═══════════════════════════════════════════════════════════════

export function ProductsPage() {
  const { searchQuery, setSearchQuery } = useAppStore();
  const { products, filters, setFilter, loading, compareList, clearCompare } = useStore();
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // ─── Filtering & sorting ───
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.brand.toLowerCase().includes(q) ||
          p.modelName.toLowerCase().includes(q) ||
          p.cameraType.toLowerCase().includes(q) ||
          p.resolution.toLowerCase().includes(q)
      );
    }

    if (filters.brand && filters.brand !== "all") {
      result = result.filter((p) => p.brand === filters.brand);
    }

    if (filters.cameraType && filters.cameraType !== "all") {
      result = result.filter((p) => p.cameraType === filters.cameraType);
    }

    if (filters.maxPrice) {
      const max = Number(filters.maxPrice);
      if (!isNaN(max)) {
        result = result.filter((p) => (p.salePrice ?? p.price) <= max);
      }
    }

    switch (filters.sortBy) {
      case "price":
        result.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case "price_desc":
        result.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case "createdAt":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, searchQuery, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setCurrentPage(1);
  };

  const handleQuickType = (type: string) => {
    setFilter("cameraType", type);
    setCurrentPage(1);
  };

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setLocalSearch("");
    setFilter("brand", "all");
    setFilter("cameraType", "all");
    setFilter("maxPrice", "");
    setFilter("sortBy", "price");
    setCurrentPage(1);
  }, [setFilter, setSearchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Page Hero ── */}
      <section className="relative overflow-hidden bg-muted/30 border-b border-border/30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/[0.05] rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-10 sm:py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
              <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">Products</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              CCTV <span className="text-emerald-600">Products</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mt-4">
              Browse our complete range of professional CCTV security cameras, recorders, and accessories from authorized brands.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              {["Authorized Dealer", "Genuine Products", "Manufacturer Warranty", "Expert Support"].map((badge) => (
                <span
                  key={badge}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400",
                    "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40",
                    "rounded-full px-3 py-1.5"
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Search + Filters Bar ── */}
      <div className="sticky top-18 z-30 bg-background/90 backdrop-blur-xl border-b border-border/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  if (e.target.value === "") {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }
                }}
                placeholder="Search by brand, model, resolution or product..."
                className="pl-11 pr-10 h-11 text-sm rounded-xl border-border/60 focus:border-emerald-500/50 shadow-sm"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Mobile filter button */}
            <Button
              variant="outline"
              className="lg:hidden gap-2 rounded-xl h-11 border-border/60"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            {/* Desktop sort */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Sort:</span>
              <Select
                value={filters.sortBy}
                onValueChange={(v) => setFilter("sortBy", v)}
              >
                <SelectTrigger className="w-[180px] h-11 rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick filter chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            {quickTypes.map((t) => {
              const active = filters.cameraType === t;
              const cfg = typeConfig[t];
              return (
                <button
                  key={t}
                  onClick={() => handleQuickType(t)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border whitespace-nowrap",
                    active
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20"
                      : "bg-background border-border/60 text-muted-foreground hover:border-emerald-500/50 hover:text-foreground hover:shadow-sm"
                  )}
                >
                  {cfg?.icon || <Camera className="h-3.5 w-3.5" />}
                  {t === "all" ? "All Types" : t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <FilterSidebar
            filters={filters}
            setFilter={(k, v) => { setFilter(k as keyof typeof filters, v); setCurrentPage(1); }}
            resetFilters={resetFilters}
          />

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0">
            {/* Result count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">{filteredProducts.length}</span>{" "}
                product{filteredProducts.length !== 1 ? "s" : ""}
              </p>
              {(filters.brand !== "all" || filters.cameraType !== "all" || filters.maxPrice || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground h-8 gap-1"
                  onClick={resetFilters}
                >
                  <X className="h-3 w-3" />
                  Clear filters
                </Button>
              )}
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="flex justify-center mb-5">
                  <div className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-2xl",
                    "bg-muted/50 border border-border/30"
                  )}>
                    <PackageX className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                  We couldn&apos;t find any products matching your current filters. Try adjusting your search or resetting filters.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 gap-2 rounded-xl"
                  onClick={resetFilters}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Reset All Filters
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  {...staggerContainer}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6"
                >
                  {paginatedProducts.map((p, i) => (
                    <motion.div key={p.id} {...staggerItem}>
                      <ProductCard p={p} index={i} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 mt-8 border-t border-border/30">
                    <p className="text-sm text-muted-foreground">
                      Showing{" "}
                      <span className="font-medium text-foreground">
                        {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium text-foreground">
                        {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-foreground">{filteredProducts.length}</span>
                    </p>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg h-9"
                        disabled={safeCurrentPage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Prev</span>
                      </Button>
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        if (
                          totalPages > 7 &&
                          page > 2 &&
                          page < totalPages - 1 &&
                          Math.abs(page - safeCurrentPage) > 1
                        ) {
                          if (page === 3 || page === totalPages - 2) {
                            return (
                              <span key={`dots-${page}`} className="text-muted-foreground text-sm px-1.5">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                        return (
                          <Button
                            key={page}
                            variant={safeCurrentPage === page ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "w-9 h-9 p-0 rounded-lg",
                              safeCurrentPage === page && "bg-emerald-600 text-white hover:bg-emerald-700"
                            )}
                            onClick={() => {
                              setCurrentPage(page);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            {page}
                          </Button>
                        );
                      })}
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg h-9"
                        disabled={safeCurrentPage >= totalPages}
                        onClick={() => {
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Trust Section ── */}
      <TrustSection />

      {/* ── Contact CTA ── */}
      <ContactCta />

      {/* ── Mobile Filter Sheet ── */}
      <MobileFilterSheet
        filters={filters}
        setFilter={(k, v) => { setFilter(k as keyof typeof filters, v); setCurrentPage(1); }}
        resetFilters={resetFilters}
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
      />

      {/* ── Compare Bar ── */}
      <AnimatePresence>
        <CompareBar
          compareList={compareList}
          clearCompare={clearCompare}
          onGoToCompare={() => router.push("/builder")}
        />
      </AnimatePresence>
    </div>
  );
}
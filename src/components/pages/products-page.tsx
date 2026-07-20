"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  PackageX
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);

const typeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  Dome: {
    icon: <Camera className="h-4 w-4" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
  },
  Bullet: {
    icon: <Camera className="h-4 w-4" />,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800"
  },
  WiFi: {
    icon: <Wifi className="h-4 w-4" />,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800"
  },
  PTZ: {
    icon: <Radio className="h-4 w-4" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800"
  },
  "4G": {
    icon: <Signal className="h-4 w-4" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800"
  },
  DVR: {
    icon: <MonitorPlay className="h-4 w-4" />,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
  },
  NVR: {
    icon: <MonitorPlay className="h-4 w-4" />,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800"
  }
};

const quickTypes = ["all", "Dome", "Bullet", "WiFi", "PTZ", "4G", "DVR", "NVR"];
const ITEMS_PER_PAGE = 12;

function ProductCard({ p, index }: { p: CctvProduct; index: number }) {
  const { addToCart } = useAppStore();
  const router = useRouter();
  const cfg = typeConfig[p.cameraType] || typeConfig.Bullet;

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
      quantity: 1
    });
    toast.success("Added to cart!");
  };

  const handleViewDetails = () => {
    router.push(`/products/${p.id}`);
  };

  const discountPercent = useMemo(() => {
    if (p.salePrice && p.salePrice < p.price) {
      return Math.round(((p.price - p.salePrice) / p.price) * 100);
    }
    return 0;
  }, [p.price, p.salePrice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 group hover:shadow-lg",
          "hover:-translate-y-1"
        )}
      >
        <div
          className={cn(
            "aspect-[4/3] bg-muted rounded-xl overflow-hidden relative cursor-pointer",
            cfg.bg
          )}
          onClick={handleViewDetails}
        >
          {p.imageUrl && (
            <img
              src={p.imageUrl}
              alt={p.modelName}
              className={cn(
                "w-full h-full object-contain p-4 transition-transform duration-300",
                "group-hover:scale-105"
              )}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          {discountPercent > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px]">
              {discountPercent}% OFF
            </Badge>
          )}
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              variant="outline"
              className={cn("text-[10px]", cfg.color, cfg.bg)}
            >
              {cfg.icon}
              {p.cameraType}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {p.resolution}
            </Badge>
          </div>
          <p className="font-semibold text-sm">{p.brand}</p>
          <p className="text-sm text-muted-foreground">{p.modelName}</p>
          <div>
            {p.salePrice && p.salePrice < p.price ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-emerald-600">
                  {fmt(p.salePrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {fmt(p.price)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold">{fmt(p.price)}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-1">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              variant="ghost"
              className="w-full gap-2"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[4/3] bg-muted animate-pulse rounded-xl" />
          <CardContent className="p-4 space-y-2">
            <div className="h-3 bg-muted rounded animate-pulse w-20" />
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
            <div className="h-3 bg-muted rounded animate-pulse w-24" />
            <div className="h-5 bg-muted rounded animate-pulse w-20" />
            <div className="h-9 bg-muted rounded animate-pulse w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ProductsPage() {
  const { searchQuery, setSearchQuery } =
    useAppStore();
  const { products, filters, setFilter, loading } = useStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);

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
        result = result.filter(
          (p) => (p.salePrice ?? p.price) <= max
        );
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
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search cameras, brands, models..."
            className="pl-12 h-12 text-base rounded-xl border-2"
          />
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {quickTypes.map((t) => {
          const active = filters.cameraType === t;
          const cfg = typeConfig[t];
          return (
            <Button
              key={t}
              variant={active ? "default" : "outline"}
              size="sm"
              className={cn("gap-1.5 text-xs")}
              onClick={() => handleQuickType(t)}
            >
              {cfg?.icon || <Camera className="h-3.5 w-3.5" />}
              {t === "all" ? "All Types" : t}
            </Button>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Filters:</Label>
          </div>
          <Select
            value={filters.brand}
            onValueChange={(v) => {
              setFilter("brand", v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="Hikvision">Hikvision</SelectItem>
              <SelectItem value="Dahua">Dahua</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.cameraType}
            onValueChange={(v) => {
              setFilter("cameraType", v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Dome">Dome</SelectItem>
              <SelectItem value="Bullet">Bullet</SelectItem>
              <SelectItem value="WiFi">WiFi</SelectItem>
              <SelectItem value="PTZ">PTZ</SelectItem>
              <SelectItem value="4G">4G</SelectItem>
              <SelectItem value="DVR">DVR</SelectItem>
              <SelectItem value="NVR">NVR</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.maxPrice || "all"}
            onValueChange={(v) => {
              setFilter("maxPrice", v === "all" ? "" : v);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="3000">Under ₹3,000</SelectItem>
              <SelectItem value="5000">Under ₹5,000</SelectItem>
              <SelectItem value="10000">Under ₹10,000</SelectItem>
              <SelectItem value="20000">Under ₹20,000</SelectItem>
              <SelectItem value="50000">Under ₹50,000</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.sortBy}
            onValueChange={(v) => setFilter("sortBy", v)}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="createdAt">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <Separator />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {filteredProducts.length}
          </span>{" "}
          products
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <PackageX className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Try adjusting your filters or search terms.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setLocalSearch("");
              setFilter("brand", "all");
              setFilter("cameraType", "all");
              setFilter("maxPrice", "");
              setFilter("sortBy", "price");
            }}
          >
            Clear All Filters
          </Button>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedProducts.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
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
                <span className="font-medium text-foreground">
                  {filteredProducts.length}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <div className="flex items-center gap-1">
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
                          <span
                            key={page}
                            className="text-muted-foreground text-sm px-1"
                          >
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
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
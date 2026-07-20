"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/app-store";
import { useStore, type CctvProduct } from "@/store/cctv-store";
import {
  ArrowLeft,
  Camera,
  Wifi,
  Radio,
  Signal,
  MonitorPlay,
  ShoppingCart,
  GitCompareArrows,
  Wrench,
  Minus,
  Plus,
  Moon,
  CloudRain,
  ScanLine,
  Expand,
  Monitor,
  Play,
} from "lucide-react";
import { toast } from "sonner";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const typeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  Dome: {
    icon: <Camera className="h-4 w-4" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  },
  Bullet: {
    icon: <Camera className="h-4 w-4" />,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800",
  },
  WiFi: {
    icon: <Wifi className="h-4 w-4" />,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800",
  },
  PTZ: {
    icon: <Radio className="h-4 w-4" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  },
  "4G": {
    icon: <Signal className="h-4 w-4" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
  },
  DVR: {
    icon: <MonitorPlay className="h-4 w-4" />,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700",
  },
  NVR: {
    icon: <MonitorPlay className="h-4 w-4" />,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800",
  },
};

export function ProductDetailPage() {
  const { selectedProduct, products, compareList, toggleCompare } = useStore();
  const { addToCart, setView } = useAppStore();
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  const product = selectedProduct;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.cameraType === product.cameraType && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const cfg = product ? typeConfig[product.cameraType] || typeConfig.Bullet : null;

  const savings = useMemo(() => {
    if (product?.salePrice && product.salePrice < product.price) {
      return product.price - product.salePrice;
    }
    return 0;
  }, [product]);

  const discountPercent = useMemo(() => {
    if (product?.salePrice && product.salePrice < product.price) {
      return Math.round(
        ((product.price - product.salePrice) / product.price) * 100
      );
    }
    return 0;
  }, [product]);

  if (!product) {
    return (
      <div className="text-center py-16">
        <Camera className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No product selected</h3>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => setView("products")}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  const isCompared = compareList.some((c) => c.id === product.id);
  const featureList = product.features
    ? product.features.split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      brand: product.brand,
      modelName: product.modelName,
      cameraType: product.cameraType,
      resolution: product.resolution,
      price: product.price,
      salePrice: product.salePrice,
      imageUrl: product.imageUrl,
      quantity,
    });
    toast.success("Added to cart!");
  };

  const handleCompare = () => {
    if (compareList.length >= 4 && !isCompared) {
      toast.error("You can compare up to 4 products at a time.");
      return;
    }
    toggleCompare(product);
    toast.success(isCompared ? "Removed from compare" : "Added to compare!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 -ml-2"
        onClick={() => setView("products")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={cn(
            "aspect-square rounded-2xl border-2 flex items-center justify-center p-8 bg-muted relative overflow-hidden",
            cfg?.bg
          )}
        >
          {!imgError && product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.modelName}
              className="max-h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <Camera className="h-20 w-20 text-muted-foreground/40" />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-5"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn(cfg?.color, cfg?.bg)}>
              {cfg?.icon}
              {product.cameraType}
            </Badge>
            <Badge variant="outline">{product.resolution}</Badge>
            <Badge variant="outline">{product.technology}</Badge>
          </div>

          <div>
            <h1 className="text-2xl font-bold">{product.brand}</h1>
            <p className="text-lg text-muted-foreground">{product.modelName}</p>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="space-y-2">
            {product.salePrice && product.salePrice < product.price ? (
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-3xl font-bold text-emerald-600">
                  {fmt(product.salePrice)}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  {fmt(product.price)}
                </span>
                <Badge className="bg-red-500 text-white">
                  Save {fmt(savings)}
                </Badge>
                <Badge className="bg-red-500/10 text-red-600 border-red-200">
                  {discountPercent}% OFF
                </Badge>
              </div>
            ) : (
              <span className="text-3xl font-bold">{fmt(product.price)}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium">Quantity:</Label>
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              className="w-full gap-2 h-12 text-base"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => setView("builder")}
            >
              <Wrench className="h-4 w-4" />
              Build With This Camera
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={!isCompared && compareList.length >= 4}
              onClick={handleCompare}
            >
              <GitCompareArrows className="h-4 w-4" />
              {isCompared ? "Remove from Compare" : "Add to Compare"}
            </Button>
          </div>
        </motion.div>
      </div>

      <Separator />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="text-lg font-bold mb-4">Specifications</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <CardContent className="p-0 flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-2">
                <Moon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Night Vision</p>
                <p className="text-sm font-medium">{product.nightVision}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent className="p-0 flex items-center gap-3">
              <div className="rounded-lg bg-sky-50 dark:bg-sky-950/40 p-2">
                <CloudRain className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Weather Rating</p>
                <p className="text-sm font-medium">{product.weatherRating}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent className="p-0 flex items-center gap-3">
              <div className="rounded-lg bg-red-50 dark:bg-red-950/40 p-2">
                <ScanLine className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">IR Range</p>
                <p className="text-sm font-medium">{product.irRange}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4">
            <CardContent className="p-0 flex items-center gap-3">
              <div className="rounded-lg bg-violet-50 dark:bg-violet-950/40 p-2">
                <Expand className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Field of View</p>
                <p className="text-sm font-medium">{product.fieldOfView}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="p-4 col-span-2 sm:col-span-1">
            <CardContent className="p-0 flex items-center gap-3">
              <div className="rounded-lg bg-teal-50 dark:bg-teal-950/40 p-2">
                <Monitor className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Recorder Type</p>
                <p className="text-sm font-medium">{product.recorderType}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {featureList.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <h2 className="text-lg font-bold mb-4">Features</h2>
          <div className="flex flex-wrap gap-2">
            {featureList.map((f: string) => (
              <Badge
                key={f}
                variant="secondary"
                className="text-sm py-1.5 px-3"
              >
                {f}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}

      {product.sampleVideoUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Play className="h-5 w-5" />
            Sample Video
          </h2>
          <div className="rounded-2xl overflow-hidden border aspect-video">
            <iframe
              src={product.sampleVideoUrl}
              className="w-full h-full"
              allowFullScreen
              title="Sample video"
            />
          </div>
        </motion.div>
      )}

      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.35 }}
        >
          <h2 className="text-lg font-bold mb-4">You May Also Like</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {relatedProducts.map((rp, i) => {
              const rpcfg = typeConfig[rp.cameraType] || typeConfig.Bullet;
              const rpDiscount =
                rp.salePrice && rp.salePrice < rp.price
                  ? Math.round(((rp.price - rp.salePrice) / rp.price) * 100)
                  : 0;
              return (
                <motion.div
                  key={rp.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="min-w-[240px] max-w-[260px] snap-start"
                >
                  <Card
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                    onClick={() => {
                      useStore.getState().setSelectedProduct(rp);
                      setView("product-detail");
                      setQuantity(1);
                      setImgError(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <div
                      className={cn(
                        "aspect-[4/3] bg-muted relative overflow-hidden",
                        rpcfg.bg
                      )}
                    >
                      {rp.imageUrl && (
                        <img
                          src={rp.imageUrl}
                          alt={rp.modelName}
                          className="w-full h-full object-contain p-3 hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      {rpDiscount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px]">
                          {rpDiscount}% OFF
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-3 space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={cn("text-[10px]", rpcfg.color, rpcfg.bg)}
                        >
                          {rpcfg.icon}
                          {rp.cameraType}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {rp.resolution}
                        </Badge>
                      </div>
                      <p className="font-semibold text-sm">{rp.brand}</p>
                      <p className="text-xs text-muted-foreground">
                        {rp.modelName}
                      </p>
                      <div>
                        {rp.salePrice && rp.salePrice < rp.price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-emerald-600">
                              {fmt(rp.salePrice)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              {fmt(rp.price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold">{fmt(rp.price)}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
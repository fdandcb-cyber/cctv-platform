"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { fmt } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useAppStore, type CartItem } from "@/store/app-store";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Heart,
  Wrench,
  Truck,
  Package,
  Star,
  Tag,
  Download,
  Share2,
  HardDrive,
  BatteryCharging,
  Cable,
  MonitorPlay,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Cart constants                                                     */
/* ------------------------------------------------------------------ */
const GST_RATE = 0.18;
const SHIPPING_THRESHOLD = 5000;

/* ------------------------------------------------------------------ */
/*  Recommended Accessories Data                                       */
/* ------------------------------------------------------------------ */
const ACCESSORIES = [
  {
    id: "hdd-1tb",
    name: "1TB Surveillance HDD",
    price: 2999,
    icon: <HardDrive className="h-5 w-5" />,
    category: "Storage",
  },
  {
    id: "ups-600va",
    name: "600VA UPS Backup",
    price: 1899,
    icon: <BatteryCharging className="h-5 w-5" />,
    category: "Power",
  },
  {
    id: "mount-kit",
    name: "Universal Mounting Kit",
    price: 499,
    icon: <Wrench className="h-5 w-5" />,
    category: "Mounting",
  },
  {
    id: "cable-20m",
    name: "20m CCTV Cable Pack",
    price: 599,
    icon: <Cable className="h-5 w-5" />,
    category: "Cables",
  },
  {
    id: "install-service",
    name: "Professional Installation",
    price: 1499,
    icon: <MonitorPlay className="h-5 w-5" />,
    category: "Service",
  },
];

/* ------------------------------------------------------------------ */
/*  Trust Badges Data                                                  */
/* ------------------------------------------------------------------ */
const TRUST_BADGES = [
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    label: "100% Genuine Products",
  },
  {
    icon: <RotateCcw className="h-4 w-4" />,
    label: "Manufacturer Warranty",
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    label: "Secure Payments",
  },
  {
    icon: <MessageCircle className="h-4 w-4" />,
    label: "Expert Support",
  },
];

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                */
/* ------------------------------------------------------------------ */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
};

/* ------------------------------------------------------------------ */
/*  Cart Item Row                                                      */
/* ------------------------------------------------------------------ */
function CartItemRow({ item, index }: { item: CartItem; index: number }) {
  const { updateQuantity, removeFromCart, addToCart } = useAppStore();
  const router = useRouter();
  const unitPrice = item.salePrice ?? item.price;
  const lineTotal = unitPrice * item.quantity;
  const hasDiscount = item.salePrice && item.salePrice < item.price;
  const savings = hasDiscount ? (item.price - item.salePrice!) * item.quantity : 0;

  const handleRemove = () => {
    removeFromCart(item.productId);
    toast.success("Item removed from cart");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative"
    >
      <Card className="rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-4 sm:gap-5">
            {/* Product Image */}
            <div
              className={cn(
                "h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-muted/50 flex-shrink-0 overflow-hidden border",
                "flex items-center justify-center"
              )}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={`${item.brand} ${item.modelName}`}
                  className="w-full h-full object-contain p-2"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <Package className="h-8 w-8 text-muted-foreground/40" />
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                    {item.brand}
                  </p>
                  <h3 className="font-semibold text-sm sm:text-base mt-0.5 truncate">
                    {item.modelName}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleRemove}
                  aria-label={`Remove ${item.modelName} from cart`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Specifications Row */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {item.cameraType}
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {item.resolution}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                >
                  <Star className="h-2.5 w-2.5 mr-0.5 fill-current" />
                  4.5
                </Badge>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  3-5 Days
                </Badge>
              </div>

              {/* Warranty & Stock */}
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  2yr Warranty
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  In Stock
                </span>
              </div>

              {/* Price + Quantity Row */}
              <div className="flex items-end justify-between mt-3 gap-3">
                {/* Prices */}
                <div>
                  <p className="text-lg sm:text-xl font-bold">{fmt(lineTotal)}</p>
                  {hasDiscount && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground line-through">
                        {fmt(item.price * item.quantity)}
                      </span>
                      <Badge className="text-[10px] px-1.5 py-0 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border-0">
                        Save {fmt(savings)}
                      </Badge>
                    </div>
                  )}
                  {item.quantity > 1 && !hasDiscount && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {fmt(unitPrice)} each
                    </p>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1">
                  {/* Wishlist */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    onClick={() => toast.info("Added to wishlist")}
                    aria-label="Add to wishlist"
                  >
                    <Heart className="h-3.5 w-3.5" />
                  </Button>
                  {/* Move to Builder */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    onClick={() => {
                      removeFromCart(item.productId);
                      router.push("/builder");
                      toast.info("Opening CCTV Builder");
                    }}
                    aria-label="Move to Builder"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                  </Button>
                  {/* Qty - */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "h-8 w-8 rounded-l-lg border flex items-center justify-center",
                      "text-muted-foreground hover:bg-muted transition-colors"
                    )}
                    onClick={() => {
                      if (item.quantity <= 1) {
                        handleRemove();
                      } else {
                        updateQuantity(item.productId, item.quantity - 1);
                      }
                    }}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-3 w-3" />
                  </motion.button>
                  <div className="h-8 w-10 flex items-center justify-center border-y text-sm font-semibold bg-muted/30">
                    {item.quantity}
                  </div>
                  {/* Qty + */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "h-8 w-8 rounded-r-lg border flex items-center justify-center",
                      "text-muted-foreground hover:bg-muted transition-colors"
                    )}
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-3 w-3" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty Cart State                                                   */
/* ------------------------------------------------------------------ */
function EmptyCartState() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="h-32 w-32 rounded-full bg-muted/60 flex items-center justify-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
        </div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
        >
          <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 rotate-[-90deg]" />
          </div>
        </motion.div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-3">Your cart is empty</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        Looks like you haven&apos;t added any products yet. Explore our range of
        professional CCTV security solutions.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20"
          onClick={() => router.push("/products")}
        >
          <ShoppingBag className="h-4 w-4" />
          Browse Products
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="gap-2 rounded-xl"
          onClick={() => router.push("/builder")}
        >
          <Wrench className="h-4 w-4" />
          Use CCTV Builder
        </Button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Cart Page                                                     */
/* ------------------------------------------------------------------ */
export function CartPage() {
  const { cart, clearCart } = useAppStore();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const cartSubtotal = cart.reduce(
    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
    0
  );
  const originalTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalSavings = originalTotal - cartSubtotal;
  const gst = Math.round(cartSubtotal * GST_RATE);
  const shipping = cartSubtotal >= SHIPPING_THRESHOLD ? 0 : 149;
  const grandTotal = cartSubtotal + gst + shipping - couponDiscount;

  const handleApplyCoupon = useCallback(() => {
    if (couponCode.trim().toUpperCase() === "CONNECTZ10") {
      const discount = Math.round(cartSubtotal * 0.1);
      setCouponDiscount(discount);
      setCouponApplied(true);
      toast.success(`Coupon applied! You save ${fmt(discount)}`);
    } else if (couponCode.trim()) {
      toast.error("Invalid coupon code. Try CONNECTZ10");
    }
  }, [couponCode, cartSubtotal]);

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const whatsappText = useMemo(() => {
    if (cart.length === 0) return "";
    const lines = cart.map((item) => {
      const price = item.salePrice ?? item.price;
      return [
        "• ",
        item.brand,
        " ",
        item.modelName,
        " (",
        item.cameraType,
        ") x",
        item.quantity,
        " — ",
        fmt(price * item.quantity),
      ].join("");
    });
    lines.push("", `Total: ${fmt(grandTotal)}`);
    return encodeURIComponent(lines.join("\n"));
  }, [cart, grandTotal]);

  const handleWhatsApp = () => {
    window.open("https://wa.me/917809465102?text=" + whatsappText, "_blank");
  };

  const handleShareCart = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My ConnectZ Cart",
          text: decodeURIComponent(whatsappText),
          url: window.location.href,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(decodeURIComponent(whatsappText));
      toast.success("Cart details copied to clipboard");
    }
  };

  const handleDownloadQuote = () => {
    const lines = [
      "CONNECTZ SALES & SERVICES",
      "Quotation / Cart Summary",
      "=".repeat(45),
      `Date: ${new Date().toLocaleDateString("en-IN")}`,
      "",
    ];
    cart.forEach((item, i) => {
      const price = item.salePrice ?? item.price;
      lines.push(`${i + 1}. ${item.brand} ${item.modelName}`);
      lines.push(`   ${item.cameraType} | ${item.resolution} | Qty: ${item.quantity}`);
      lines.push(`   Price: ${fmt(price * item.quantity)}`);
      lines.push("");
    });
    lines.push("-".repeat(45));
    lines.push(`Subtotal:  ${fmt(cartSubtotal)}`);
    if (totalSavings > 0) lines.push(`Savings:    ${fmt(totalSavings)}`);
    lines.push(`GST (18%):  ${fmt(gst)}`);
    lines.push(`Shipping:   ${shipping === 0 ? "FREE" : fmt(shipping)}`);
    if (couponDiscount > 0) lines.push(`Coupon:     -${fmt(couponDiscount)}`);
    lines.push("=".repeat(45));
    lines.push(`GRAND TOTAL: ${fmt(grandTotal)}`);
    lines.push("", "Contact: 7809465102 | connectzsalesandservices@gmail.com");

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ConnectZ_Quote.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Quote downloaded");
  };

  /* Empty state */
  if (cart.length === 0) return <EmptyCartState />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight">Shopping Cart</h1>
            <Badge
              variant="secondary"
              className="text-sm px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
            >
              {cartCount} item{cartCount !== 1 ? "s" : ""}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {cartCount} product{cartCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl"
            onClick={handleDownloadQuote}
          >
            <Download className="h-3.5 w-3.5" />
            Download Quote
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl"
            onClick={handleShareCart}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive gap-1.5 rounded-xl"
            onClick={handleClearCart}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear All
          </Button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Cart Items ── */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="popLayout">
            <motion.div
              {...staggerContainer}
              className="space-y-4"
            >
              {cart.map((item, i) => (
                <motion.div key={item.productId} {...staggerItem}>
                  <CartItemRow item={item} index={i} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* ── Recommended Accessories ── */}
          <motion.div {...fadeUp} className="mt-10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Recommended Accessories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ACCESSORIES.map((acc) => (
                <motion.div
                  key={acc.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:group-hover:bg-emerald-950/40 dark:group-hover:text-emerald-400 transition-colors">
                        {acc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{acc.name}</p>
                        <p className="text-xs text-muted-foreground">{acc.category}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold">{fmt(acc.price)}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-xs text-emerald-600 hover:text-emerald-700 p-0"
                          onClick={() =>
                            toast.info(`${acc.name} added to cart`)
                          }
                        >
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right: Sticky Order Summary ── */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <Card className="rounded-2xl border shadow-sm">
              <CardContent className="p-6 space-y-5">
                <h2 className="text-lg font-bold">Order Summary</h2>

                {/* Line items */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({cartCount} item{cartCount !== 1 ? "s" : ""})
                    </span>
                    <span className="font-medium">{fmt(cartSubtotal)}</span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        Discount
                      </span>
                      <span className="font-medium">-{fmt(totalSavings)}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        Coupon (CONNECTZ10)
                      </span>
                      <span className="font-medium">-{fmt(couponDiscount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium">{fmt(gst)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" />
                      Shipping
                    </span>
                    {shipping === 0 ? (
                      <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        FREE
                      </span>
                    ) : (
                      <span className="font-medium">{fmt(shipping)}</span>
                    )}
                  </div>

                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {fmt(SHIPPING_THRESHOLD - cartSubtotal)} more for free shipping
                    </p>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Grand Total</span>
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {fmt(grandTotal)}
                  </span>
                </div>

                {totalSavings + couponDiscount > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3">
                    <Tag className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      You save <strong>{fmt(totalSavings + couponDiscount)}</strong> on this order
                    </p>
                  </div>
                )}

                {/* Coupon Code */}
                {!couponApplied && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="rounded-xl h-10"
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    />
                    <Button
                      variant="outline"
                      className="rounded-xl h-10 px-4 shrink-0"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-3">
                    <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      CONNECTZ10 applied
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground"
                      onClick={() => {
                        setCouponApplied(false);
                        setCouponDiscount(0);
                        setCouponCode("");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                {/* Delivery Estimate */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl p-3">
                  <Truck className="h-4 w-4 flex-shrink-0" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <Button
                    className="w-full h-12 text-base gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
                    onClick={() => router.push("/checkout")}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 rounded-xl"
                    onClick={() => router.push("/products")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </div>

                <Separator />

                {/* WhatsApp Share */}
                <Button
                  variant="outline"
                  className="w-full gap-2 rounded-xl"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  Share Cart via WhatsApp
                </Button>

                {/* Secure Payment Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Secure checkout powered by Razorpay</span>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 rounded-xl border bg-card p-3 text-xs text-muted-foreground"
                >
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {badge.icon}
                  </span>
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

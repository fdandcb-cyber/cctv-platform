"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { toast } from "sonner";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function CartItemRow({ item, index }: { item: CartItem; index: number }) {
  const { updateQuantity, removeFromCart } = useAppStore();
  const unitPrice = item.salePrice ?? item.price;
  const lineTotal = unitPrice * item.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className="flex items-center gap-4 py-4"
    >
      <div className="h-20 w-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden border">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.modelName}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{item.brand}</p>
        <p className="text-sm text-muted-foreground truncate">
          {item.modelName}
        </p>
        <Badge variant="outline" className="text-[10px] mt-1">
          {item.cameraType} &middot; {item.resolution}
        </Badge>
      </div>

      <div className="hidden sm:block text-right min-w-[80px]">
        <p className="text-sm font-medium">{fmt(unitPrice)}</p>
        {item.salePrice && item.salePrice < item.price && (
          <p className="text-xs text-muted-foreground line-through">
            {fmt(item.price)}
          </p>
        )}
      </div>

      <div className="flex items-center border rounded-lg">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-r-none"
          onClick={() => {
            if (item.quantity <= 1) {
              removeFromCart(item.productId);
              toast.success("Item removed from cart");
            } else {
              updateQuantity(item.productId, item.quantity - 1);
            }
          }}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">
          {item.quantity}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-l-none"
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="text-right min-w-[80px]">
        <p className="font-bold text-sm">{fmt(lineTotal)}</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
        onClick={() => {
          removeFromCart(item.productId);
          toast.success("Item removed from cart");
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}

export function CartPage() {
  const { cart, cartTotal, cartCount, clearCart, setView } = useAppStore();

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
    lines.push("", "Total: " + fmt(cartTotal));
    return encodeURIComponent(lines.join("\n"));
  }, [cart, cartTotal]);

  const handleWhatsApp = () => {
    const url = "https://wa.me/917809465102?text=" + whatsappText;
    window.open(url, "_blank");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven&apos;t added any products yet.
        </p>
        <Button
          className="gap-2"
          onClick={() => setView("products")}
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Products
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <Badge variant="secondary" className="text-base px-2.5">
            {cartCount}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive gap-1.5"
          onClick={handleClearCart}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-1">
          {cart.map((item, i) => (
            <div key={item.productId}>
              <CartItemRow item={item} index={i} />
              {i < cart.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-5">
              <h2 className="text-lg font-bold">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal ({cartCount} item{cartCount !== 1 ? "s" : ""})
                  </span>
                  <span className="font-medium">{fmt(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Free installation included
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold">{fmt(cartTotal)}</span>
              </div>

              <Button
                className="w-full h-12 text-base gap-2"
                onClick={() => setView("checkout")}
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                className="w-full gap-2"
                onClick={() => setView("products")}
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>

              <Separator />

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>
                  Secure checkout powered by Razorpay. Your payment information
                  is encrypted and protected.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                Share Cart via WhatsApp
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
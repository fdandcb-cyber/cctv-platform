"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/app-store";
import { RazorpayCheckout } from "@/components/razorpay-checkout";
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Package,
} from "lucide-react";
import { toast } from "sonner";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function CheckoutPage() {
  const { cart, setView, clearCart } = useAppStore();
  const cartTotal = cart.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill in all shipping details");
      return;
    }
    const orderId =
      "CZ-" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase();
    setOrderNumber(orderId);
    setOrderPlaced(true);
    toast.success("Order placed successfully!");
  };

  const handlePaymentSuccess = () => {
    const orderId =
      "CZ-" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 6).toUpperCase();
    setOrderNumber(orderId);
    setOrderPlaced(true);
    clearCart();
    toast.success("Order placed successfully!");
  };

  if (cart.length === 0 && !orderPlaced) {
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
        <h2 className="text-2xl font-bold mb-2">Cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Add some products before proceeding to checkout.
        </p>
        <Button className="gap-2" onClick={() => setView("products")}>
          <ArrowLeft className="h-4 w-4" />
          Browse Products
        </Button>
      </motion.div>
    );
  }

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center py-20"
      >
        <div className={cn("inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 dark:bg-emerald-950/40 mb-6")}>
          <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Order Placed!</h2>
        <p className="text-muted-foreground mb-1">
          Thank you for your purchase.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Your order number is{" "}
          <span className="font-bold text-foreground">{orderNumber}</span>
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button className="gap-2" onClick={() => setView("home")}>
            <Package className="h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
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
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5"
          onClick={() => setView("cart")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Button>
      </div>

      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Order Items */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Items
                <Badge variant="secondary" className="ml-auto">
                  {cartCount}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {cart.map((item) => {
                const unitPrice = item.salePrice ?? item.price;
                const lineTotal = unitPrice * item.quantity;
                return (
                  <div key={item.productId}>
                    <div className="flex items-center gap-4 py-3">
                      <div className="h-16 w-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden border">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.modelName}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {item.brand}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.modelName}
                        </p>
                        <Badge variant="outline" className="text-[10px] mt-1">
                          {item.cameraType} &middot; {item.resolution}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-bold text-sm">{fmt(lineTotal)}</p>
                        {item.salePrice && item.salePrice < item.price && (
                          <p className="text-xs text-muted-foreground line-through">
                            {fmt(item.price * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Separator />
                  </div>
                );
              })}

              {/* Order Summary */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{fmt(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Free
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold">{fmt(cartTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Shipping Details Form */}
        <div className="lg:col-span-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-base">Shipping Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="checkout-name">Full Name</Label>
                <Input
                  id="checkout-name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="checkout-email">Email</Label>
                <Input
                  id="checkout-email"
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="checkout-phone">Phone</Label>
                <Input
                  id="checkout-phone"
                  type="tel"
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="checkout-address">Address</Label>
                <Textarea
                  id="checkout-address"
                  placeholder="Street address, house no., landmark..."
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-city">City</Label>
                  <Input
                    id="checkout-city"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-state">State</Label>
                  <Input
                    id="checkout-state"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-pincode">Pincode</Label>
                  <Input
                    id="checkout-pincode"
                    placeholder="560001"
                    value={form.pincode}
                    onChange={(e) => updateField("pincode", e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <RazorpayCheckout
                  amount={cartTotal}
                  quoteData={{
                    items: cart,
                    shipping: form,
                  }}
                  label={cn("w-full h-12 text-base")}
                  size="lg"
                  className="w-full h-12 text-base"
                />

                <Button
                  variant="outline"
                  className="w-full h-12 text-base"
                  onClick={handlePlaceOrder}
                >
                  Place Order (Pay Later)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
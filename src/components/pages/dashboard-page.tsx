"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/store/app-store";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Package,
  LogOut,
  Pencil,
  Check,
  ShoppingBag,
  ArrowRight,
  IndianRupee,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
};

export function DashboardPage() {
  const { user, isAuthenticated, cart, cartCount, cartTotal, setView, logout } =
    useAppStore();

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Please Login</h2>
          <p className="text-muted-foreground">
            You need to be logged in to view your dashboard.
          </p>
          <Button className="gap-2" onClick={() => setView("login")}>
            <User className="h-4 w-4" />
            Login
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    if (!editForm.name || !editForm.email) {
      toast.error("Name and email are required");
      return;
    }
    setEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold">My Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-50")}>
                  <ShoppingCart className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cart Items</p>
                  <p className="text-2xl font-bold">{cartCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50")}>
                  <IndianRupee className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cart Value</p>
                  <p className="text-2xl font-bold">{fmt(cartTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg bg-amber-50")}>
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={cn("flex items-center justify-center h-10 w-10 rounded-lg bg-purple-50")}>
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-2xl font-bold">{cartCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Profile Card */}
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </CardTitle>
              {!editing ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5"
                    onClick={handleSaveProfile}
                  >
                    <Check className="h-3.5 w-3.5" />
                    Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100")}>
                      <User className="h-5 w-5 text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        Customer
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span>{user.phone || "Not provided"}</span>
                    </div>
                    {user.address && (
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <span>
                          {user.address}
                          {user.city && ", " + user.city}
                          {user.state && ", " + user.state}
                          {user.pincode && " — " + user.pincode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Order History */}
        <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className={cn("inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4")}>
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No orders yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  When you place an order, it will appear here.
                </p>
                <Button className="gap-2" onClick={() => setView("products")}>
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setView("cart")}
          >
            <ShoppingCart className="h-4 w-4" />
            My Cart
            {cartCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {cartCount}
              </Badge>
            )}
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setView("products")}
          >
            <Package className="h-4 w-4" />
            Browse Products
          </Button>
          <Button variant="destructive" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
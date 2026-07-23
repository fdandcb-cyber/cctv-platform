"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, LogIn, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AdminLoginProps {
  onLogin: (token: string, user: { email: string; role: string }) => void;
  onBack: () => void;
}

export function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.user));
        toast.success("Welcome back, Admin!");
        onLogin(data.token, data.user);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch {
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="mx-auto w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center shadow-sm">
              <Shield className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-bold">Admin Login</CardTitle>
            <CardDescription className="text-muted-foreground">
              ConnectZ Sales & Services — Control Panel
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@connectz.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white h-11"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full gap-2 text-muted-foreground hover:text-foreground"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Catalog
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
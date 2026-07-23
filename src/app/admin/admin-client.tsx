"use client";

import { useState, useEffect } from "react";
import { AdminPanel } from "@/components/admin-panel";
import { AdminLogin } from "@/components/admin-login";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function AdminClient() {
  const [adminAuth, setAdminAuth] = useState<{
    token: string;
    user: { email: string; role: string };
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const userStr = localStorage.getItem("admin_user");
    if (token && userStr) {
      fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.valid) setAdminAuth({ token, user: JSON.parse(userStr) });
        })
        .catch(() => {});
    }
  }, []);

  function handleAdminLogin(token: string, user: { email: string; role: string }) {
    setAdminAuth({ token, user });
  }

  function handleAdminLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setAdminAuth(null);
    toast.success("Logged out");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className={cn("flex items-center gap-2")}>
            <img src="/logo.svg" alt={BRAND.name} className={cn("h-8 w-8")} />
            <span className={cn("text-lg font-bold")}>{BRAND.name}</span>
          </Link>
          {adminAuth && (
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={cn(
                  "text-emerald-700 bg-emerald-50 border-emerald-200"
                )}
              >
                <Shield className="h-3 w-3 mr-1" />
                {adminAuth.user.email}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className={cn("gap-1 text-red-500")}
                onClick={handleAdminLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
        {adminAuth ? (
          <AdminPanel onBack={() => {}} />
        ) : (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => {}}
          />
        )}
      </div>
    </div>
  );
}
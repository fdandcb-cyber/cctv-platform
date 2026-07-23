"use client";

import { useState, useEffect } from "react";
import { AdminPanel } from "@/components/admin-panel";
import { AdminLogin } from "@/components/admin-login";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Shield, LogOut, Sun, Moon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AdminClient() {
  const [adminAuth, setAdminAuth] = useState<{
    token: string;
    user: { email: string; role: string };
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className={cn("flex items-center gap-2.5 group")}>
            <img src="/logo.svg" alt={BRAND.name} className={cn("h-8 w-8")} />
            <span className={cn("text-lg font-bold")}>{BRAND.name}</span>
            <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0 ml-1 text-muted-foreground">Admin</Badge>
          </Link>
          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
            {adminAuth ? (
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800"
                  )}
                >
                  <Shield className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{adminAuth.user.email}</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={handleAdminLogout}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={() => router.push("/")}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back to Site</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          {adminAuth ? (
            <AdminPanel onBack={() => router.push("/")} />
          ) : (
            <AdminLogin
              onLogin={handleAdminLogin}
              onBack={() => router.push("/")}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {BRAND.name}. Admin Panel.</span>
          <Link href="/" className="hover:text-foreground transition-colors">
            View Store →
          </Link>
        </div>
      </footer>
    </div>
  );
}
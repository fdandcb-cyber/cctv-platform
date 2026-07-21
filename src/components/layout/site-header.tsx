"use client";

import { useState, useSyncExternalStore, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Sun,
  Moon,
  Menu,
  X,
  Settings,
  LayoutDashboard,
  LogOut,
  User,
  ArrowRight,
} from "lucide-react";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Learn", href: "/learn" },
  { label: "Builder", href: "/builder" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const cart = useAppStore((s) => s.cart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const user = useAppStore((s) => s.user);
  const userToken = useAppStore((s) => s.userToken);
  const isAuthenticated = !!userToken && !!user;
  const {
    mobileMenuOpen,
    toggleMobileMenu,
    logout,
    searchQuery,
    setSearchQuery,
  } = useAppStore();

  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavClick() {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl shadow-sm border-b border-border/50"
          : "bg-background/60 backdrop-blur-lg border-b border-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8"
        )}
      >
        {/* Left: Logo */}
        <Link
          href="/"
          className={cn("flex items-center gap-2.5")}
          onClick={handleNavClick}
        >
          <img src="/logo.svg" alt="ConnectZ" className={cn("h-9 w-9")} />
          <span className={cn("text-xl font-bold tracking-tight")}>ConnectZ</span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className={cn("hidden lg:flex items-center gap-1")}>
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className={cn(
                      "absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-emerald-500"
                    )}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className={cn("flex items-center gap-1.5")}>
          {/* Get Quote CTA - Desktop */}
          <Link href="/builder" className="hidden lg:block">
            <Button
              size="sm"
              className={cn(
                "gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700",
                "shadow-sm shadow-emerald-600/20",
                "transition-all duration-200 hover:shadow-md hover:shadow-emerald-600/30 hover:scale-[1.03]"
              )}
            >
              Get Quote
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>

          {/* Search */}
          {searchOpen ? (
            <div className={cn("flex items-center gap-1")}>
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn("h-9 w-40 sm:w-56")}
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                aria-label="Close search"
              >
                <X className={cn("h-4 w-4")} />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded-lg"
            >
              <Search className={cn("h-4 w-4")} />
            </Button>
          )}

          {/* Cart */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className={cn("relative rounded-lg")}
              aria-label="Cart"
            >
              <ShoppingCart className={cn("h-4 w-4")} />
              {cartCount > 0 && (
                <Badge
                  className={cn(
                    "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] bg-emerald-600 text-white border-2 border-background"
                  )}
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="hidden sm:inline-flex rounded-lg"
            >
              {theme === "dark" ? (
                <Sun className={cn("h-4 w-4")} />
              ) : (
                <Moon className={cn("h-4 w-4")} />
              )}
            </Button>
          )}

          {/* Admin link */}
          <Link href="/admin">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden sm:inline-flex rounded-lg",
                "text-muted-foreground hover:text-foreground"
              )}
              aria-label="Admin"
            >
              <Settings className={cn("h-4 w-4")} />
            </Button>
          </Link>

          {/* Auth */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-9 w-9 rounded-full")}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-semibold"
                    )}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className={cn("flex flex-col space-y-1")}>
                    <p className={cn("text-sm font-medium")}>{user.name}</p>
                    <p className={cn("text-xs text-muted-foreground")}>
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard className={cn("mr-2 h-4 w-4")} />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                  }}
                  className={cn("text-destructive")}
                >
                  <LogOut className={cn("mr-2 h-4 w-4")} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button
                variant="ghost"
                size="sm"
                className={cn("hidden sm:inline-flex rounded-lg")}
              >
                <User className={cn("mr-1.5 h-4 w-4")} />
                Login
              </Button>
            </Link>
          )}

          {/* Mobile Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className={cn("lg:hidden rounded-lg")}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <Menu className={cn("h-5 w-5")} />
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={toggleMobileMenu}>
        <SheetContent side={"right"} className={cn("w-full sm:max-w-sm")}>
          <SheetHeader>
            <SheetTitle className={cn("flex items-center gap-2.5")}>
              <img
                src="/logo.svg"
                alt="ConnectZ"
                className={cn("h-8 w-8")}
              />
              ConnectZ
            </SheetTitle>
          </SheetHeader>

          <nav className={cn("flex flex-col gap-1 px-4 pt-4")}>
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className={cn("my-4 h-px bg-border")} />

            {/* Mobile CTA */}
            <Link href="/builder" onClick={handleNavClick}>
              <Button
                className={cn(
                  "w-full gap-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700",
                  "shadow-sm shadow-emerald-600/20"
                )}
              >
                Get Quote
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <div className={cn("my-4 h-px bg-border")} />

            {isAuthenticated && user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <LayoutDashboard className={cn("h-5 w-5")} />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-destructive hover:bg-destructive/10"
                  )}
                >
                  <LogOut className={cn("h-5 w-5")} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={handleNavClick}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <User className={cn("h-5 w-5")} />
                Login
              </Link>
            )}

            <Link
              href="/admin"
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Settings className={cn("h-5 w-5")} />
              Admin
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
"use client";

import { useState, useSyncExternalStore } from "react";
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
} from "lucide-react";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
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
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  function handleNavClick() {
    if (mobileMenuOpen) {
      toggleMobileMenu();
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b",
        "bg-background/80 backdrop-blur-lg"
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 max-w-7xl items-center justify-between px-4"
        )}
      >
        {/* Left: Logo */}
        <Link
          href="/"
          className={cn("flex items-center gap-2")}
          onClick={handleNavClick}
        >
          <img src="/logo.svg" alt="ConnectZ" className={cn("h-8 w-8")} />
          <span className={cn("text-lg font-bold")}>ConnectZ</span>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className={cn("hidden md:flex items-center gap-6")}>
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
                  "text-sm font-medium transition-opacity hover:opacity-80",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className={cn("flex items-center gap-1")}>
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
            >
              <Search className={cn("h-4 w-4")} />
            </Button>
          )}

          {/* Cart */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              className={cn("relative")}
              aria-label="Cart"
            >
              <ShoppingCart className={cn("h-4 w-4")} />
              {cartCount > 0 && (
                <Badge
                  className={cn(
                    "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
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
              size="sm"
              className={cn(
                "hidden sm:flex items-center gap-1 text-xs text-muted-foreground"
              )}
            >
              <Settings className={cn("h-3.5 w-3.5")} />
              <span>Admin</span>
            </Button>
          </Link>

          {/* Auth */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-8 w-8 rounded-full")}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold"
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
                className={cn("hidden sm:flex")}
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
            className={cn("md:hidden")}
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
            <SheetTitle className={cn("flex items-center gap-2")}>
              <img
                src="/logo.svg"
                alt="ConnectZ"
                className={cn("h-7 w-7")}
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
                    "flex items-center justify-between rounded-lg px-4 py-4 text-base font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className={cn("my-3 h-px bg-border")} />

            {isAuthenticated && user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
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
                    "flex items-center gap-3 rounded-lg px-4 py-4 text-base font-medium text-destructive hover:bg-destructive/10"
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
                  "flex items-center gap-3 rounded-lg px-4 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
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
                "flex items-center gap-3 rounded-lg px-4 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
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
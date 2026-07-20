"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAppStore, type AppView } from "@/store/app-store";
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

const NAV_LINKS: { label: string; view: AppView }[] = [
  { label: "Home", view: "home" },
  { label: "Products", view: "products" },
  { label: "Services", view: "services" },
  { label: "Builder", view: "builder" },
  { label: "About", view: "about" },
  { label: "Contact", view: "contact" },
];

export function SiteHeader() {
  const {
    view,
    setView,
    cartCount,
    mobileMenuOpen,
    toggleMobileMenu,
    isAuthenticated,
    user,
    logout,
    searchQuery,
    setSearchQuery,
  } = useAppStore();

  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleNavClick(targetView: AppView) {
    setView(targetView);
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
        <button
          onClick={() => setView("home")}
          className={cn("flex items-center gap-2")}
        >
          <img src="/logo.svg" alt="ConnectZ" className={cn("h-8 w-8")} />
          <span className={cn("text-lg font-bold")}>ConnectZ</span>
        </button>

        {/* Center: Desktop Nav */}
        <nav className={cn("hidden md:flex items-center gap-6")}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.view}
              onClick={() => handleNavClick(link.view)}
              className={cn(
                "text-sm font-medium transition-opacity hover:opacity-80",
                view === link.view
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </button>
          ))}
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
          <Button
            variant="ghost"
            size="icon"
            className={cn("relative")}
            onClick={() => setView("cart")}
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
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hidden sm:flex items-center gap-1 text-xs text-muted-foreground"
            )}
            onClick={() => setView("admin")}
          >
            <Settings className={cn("h-3.5 w-3.5")} />
            <span>Admin</span>
          </Button>

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
                <DropdownMenuItem onClick={() => setView("dashboard")}>
                  <LayoutDashboard className={cn("mr-2 h-4 w-4")} />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className={cn("text-destructive")}
                >
                  <LogOut className={cn("mr-2 h-4 w-4")} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className={cn("hidden sm:flex")}
              onClick={() => setView("login")}
            >
              <User className={cn("mr-1.5 h-4 w-4")} />
              Login
            </Button>
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
            {NAV_LINKS.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-4 py-4 text-base font-medium transition-colors",
                  view === link.view
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </button>
            ))}

            <div className={cn("my-3 h-px bg-border")} />

            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => handleNavClick("dashboard")}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <LayoutDashboard className={cn("h-5 w-5")} />
                  Dashboard
                </button>
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
              <button
                onClick={() => handleNavClick("login")}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <User className={cn("h-5 w-5")} />
                Login
              </button>
            )}

            <button
              onClick={() => handleNavClick("admin")}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-4 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Settings className={cn("h-5 w-5")} />
              Admin
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
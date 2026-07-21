"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Builder", href: "/builder" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SERVICES = [
  "Site Survey",
  "Installation",
  "AMC Support",
  "Remote Monitoring",
  "Access Control",
];

export function SiteFooter() {
  return (
    <footer className={cn("bg-primary text-primary-foreground")}>
      <div className={cn("mx-auto max-w-7xl px-4 py-12 sm:py-16")}>
        <div className={cn("grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4")}>
          {/* Column 1: Brand */}
          <div className={cn("space-y-4 sm:col-span-2 lg:col-span-2")}>
            <div className={cn("flex items-center gap-2")}>
              <img
                src="/logo.svg"
                alt="ConnectZ"
                className={cn("h-8 w-8 brightness-0 invert")}
              />
              <span className={cn("text-lg font-bold")}>ConnectZ</span>
            </div>
            <p className={cn("text-sm leading-relaxed text-primary-foreground/80")}>
              Your trusted partner for professional CCTV security solutions
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className={cn("space-y-4")}>
            <h3 className={cn("text-sm font-semibold uppercase tracking-wider text-primary-foreground/60")}>
              Quick Links
            </h3>
            <ul className={cn("space-y-2.5")}>
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground hover:underline"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className={cn("space-y-4")}>
            <h3 className={cn("text-sm font-semibold uppercase tracking-wider text-primary-foreground/60")}>
              Services
            </h3>
            <ul className={cn("space-y-2.5")}>
              {SERVICES.map((service) => (
                <li key={service}>
                  <span className={cn("text-sm text-primary-foreground/80")}>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className={cn("space-y-4")}>
            <h3 className={cn("text-sm font-semibold uppercase tracking-wider text-primary-foreground/60")}>
              Legal
            </h3>
            <ul className={cn("space-y-2.5")}>
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground hover:underline"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className={cn("space-y-4")}>
            <h3 className={cn("text-sm font-semibold uppercase tracking-wider text-primary-foreground/60")}>
              Contact Us
            </h3>
            <ul className={cn("space-y-3")}>
              <li>
                <a
                  href="tel:7809465102"
                  className={cn(
                    "flex items-center gap-2.5 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  )}
                >
                  <Phone className={cn("h-4 w-4 shrink-0")} />
                  7809465102
                </a>
              </li>
              <li>
                <a
                  href="mailto:connectzsalesandservices@gmail.com"
                  className={cn(
                    "flex items-center gap-2.5 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  )}
                >
                  <Mail className={cn("h-4 w-4 shrink-0")} />
                  <span className={cn("break-all")}>
                    connectzsalesandservices@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <div className={cn("flex items-center gap-2.5 text-sm text-primary-foreground/80")}>
                  <MapPin className={cn("h-4 w-4 shrink-0")} />
                  India
                </div>
              </li>
              <li>
                <a
                  href="https://wa.me/917809465102"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                  )}
                >
                  <MessageCircle className={cn("h-4 w-4 shrink-0")} />
                  WhatsApp
                  <ExternalLink className={cn("h-3 w-3")} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={cn("border-t border-primary-foreground/10")}>
        <div className={cn(
          "mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row"
        )}>
          <p className={cn("text-xs text-primary-foreground/60")}>
            © 2025 ConnectZ Sales &amp; Services. All rights reserved.
          </p>
          <p className={cn("text-xs text-primary-foreground/60")}>
            Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
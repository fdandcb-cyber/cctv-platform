"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ExternalLink,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Learn", href: "/learn" },
  { label: "Builder", href: "/builder" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const RESOURCES: { label: string; href: string }[] = [
  { label: "CCTV Camera Types", href: "/learn" },
  { label: "Buying Guide", href: "/learn" },
  { label: "Installation Tips", href: "/learn" },
  { label: "Comparison Tool", href: "/builder" },
  { label: "FAQs", href: "/learn" },
  { label: "Warranty Information", href: "/learn" },
  { label: "Blog", href: "/learn" },
];

const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
];

/* ------------------------------------------------------------------ */
/*  Social SVGs (Lucide-style 24×24 stroke icons)                   */
/* ------------------------------------------------------------------ */

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com/connectz",
    icon: FacebookIcon,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/connectz",
    icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/connectz",
    icon: LinkedinIcon,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@connectz",
    icon: YoutubeIcon,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/917809465102",
    icon: WhatsAppIcon,
  },
];

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

export function SiteFooter() {
  return (
    <footer className="bg-[#111827] text-gray-300">
      {/* Main grid */}
      <div className={cn("mx-auto max-w-7xl px-4 pt-16 pb-10 sm:pt-20 sm:pb-14")}>
        <div className={cn(
          "grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12"
        )}>
          {/* ── Column 1: Brand ──────────────────────────────── */}
          <div className={cn("sm:col-span-2 lg:col-span-4")}>
            {/* Logo + name */}
            <Link href="/" className={cn("inline-flex items-center gap-3")}>
              <img
                src="/logo.svg"
                alt="ConnectZ logo"
                className={cn("h-10 w-10 brightness-0 invert")}
              />
              <span className={cn("text-2xl font-bold text-white tracking-tight")}>
                ConnectZ
              </span>
            </Link>

            {/* Tagline */}
            <p
              className={cn(
                "mt-4 text-sm leading-relaxed text-gray-400 max-w-xs"
              )}
            >
              Your trusted partner for professional CCTV security solutions.
            </p>

            {/* Social icons */}
            <div
              className={cn(
                "mt-6 flex items-center gap-3"
              )}
            >
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    "bg-white/5 text-gray-400",
                    "transition-all duration-200",
                    "hover:bg-[#2563EB] hover:text-white hover:scale-110"
                  )}
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 2: Quick Links ────────────────────────── */}
          <nav aria-label="Quick links" className={cn("sm:col-span-1 lg:col-span-2")}>
            <h3
              className={cn(
                "text-sm font-semibold uppercase tracking-wider text-white mb-5"
              )}
            >
              Quick Links
            </h3>
            <ul className={cn("space-y-3")}>
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm text-gray-400 transition-colors duration-200",
                      "hover:text-[#60A5FA] hover:underline underline-offset-4"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Column 3: Resources ──────────────────────────── */}
          <nav aria-label="Resources" className={cn("sm:col-span-1 lg:col-span-2")}>
            <h3
              className={cn(
                "text-sm font-semibold uppercase tracking-wider text-white mb-5"
              )}
            >
              Resources
            </h3>
            <ul className={cn("space-y-3")}>
              {RESOURCES.map((res) => (
                <li key={res.label}>
                  <Link
                    href={res.href}
                    className={cn(
                      "text-sm text-gray-400 transition-colors duration-200",
                      "hover:text-[#60A5FA] hover:underline underline-offset-4"
                    )}
                  >
                    {res.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Column 4: Support ──────────────────────────── */}
          <nav aria-label="Support" className={cn("sm:col-span-1 lg:col-span-2")}>
            <h3
              className={cn(
                "text-sm font-semibold uppercase tracking-wider text-white mb-5"
              )}
            >
              Support
            </h3>
            <ul className={cn("space-y-3")}>
              {["FAQs", "Warranty Information", "Return Policy", "Shipping Info", "Track Order"].map((label) => (
                <li key={label}>
                  <Link
                    href="/learn"
                    className={cn(
                      "text-sm text-gray-400 transition-colors duration-200",
                      "hover:text-[#60A5FA] hover:underline underline-offset-4"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Column 5: Contact ────────────────────────────── */}
          <address className={cn("sm:col-span-2 lg:col-span-2 not-italic")}>
            <h3
              className={cn(
                "text-sm font-semibold uppercase tracking-wider text-white mb-5"
              )}
            >
              Contact
            </h3>
            <ul className={cn("space-y-4")}>
              {/* Phone */}
              <li>
                <a
                  href="tel:+917809465102"
                  className={cn(
                    "inline-flex items-center gap-3 text-sm text-gray-400",
                    "transition-colors duration-200 hover:text-[#60A5FA]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5"
                    )}
                  >
                    <Phone className={cn("h-4 w-4")} />
                  </span>
                  +91 78094 65102
                </a>
              </li>

              {/* Email */}
              <li>
                <a
                  href="mailto:connectzsalesandservices@gmail.com"
                  className={cn(
                    "inline-flex items-start gap-3 text-sm text-gray-400",
                    "transition-colors duration-200 hover:text-[#60A5FA]"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5"
                    )}
                  >
                    <Mail className={cn("h-4 w-4")} />
                  </span>
                  <span className={cn("break-all")}>
                    connectzsalesandservices@gmail.com
                  </span>
                </a>
              </li>

              {/* WhatsApp */}
              <li>
                <a
                  href="https://wa.me/917809465102"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-3 text-sm text-gray-400",
                    "transition-colors duration-200 hover:text-[#60A5FA]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5"
                    )}
                  >
                    <MessageCircle className={cn("h-4 w-4")} />
                  </span>
                  WhatsApp Chat
                  <ExternalLink className={cn("h-3 w-3 opacity-50")} />
                </a>
              </li>

              {/* Address */}
              <li>
                <div
                  className={cn(
                    "inline-flex items-start gap-3 text-sm text-gray-400"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5"
                    )}
                  >
                    <MapPin className={cn("h-4 w-4")} />
                  </span>
                  ConnectZ Sales & Services,<br />
                  India
                </div>
              </li>

              {/* Working hours */}
              <li>
                <div
                  className={cn(
                    "inline-flex items-start gap-3 text-sm text-gray-400"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5"
                    )}
                  >
                    <Clock className={cn("h-4 w-4")} />
                  </span>
                  <div>
                    <p className={cn("text-white font-medium")}>Working Hours</p>
                    <p>Mon – Sat: 9:00 AM – 7:00 PM</p>
                    <p>Sun: Closed</p>
                  </div>
                </div>
              </li>
            </ul>
          </address>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────── */}
      <div className={cn("border-t border-white/10")}>
        <div
          className={cn(
            "mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6",
            "sm:flex-row"
          )}
        >
          <p className={cn("text-xs text-gray-500")}>
            &copy; 2026 ConnectZ. All Rights Reserved.
          </p>
          <nav
            aria-label="Legal"
            className={cn(
              "flex flex-wrap items-center justify-center gap-x-5 gap-y-1"
            )}
          >
            {LEGAL_LINKS.map((link, i) => (
              <span key={link.href} className={cn("flex items-center gap-x-5")}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-xs text-gray-500 transition-colors duration-200",
                    "hover:text-[#60A5FA]"
                  )}
                >
                  {link.label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && (
                  <span className={cn("text-gray-700 select-none")} aria-hidden="true">
                    |
                  </span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

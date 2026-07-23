"use client";

import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

interface WhatsAppShareProps {
  text: string;
  label?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function WhatsAppShare({
  text,
  label = "Share on WhatsApp",
  variant = "default",
  size = "default",
  className,
}: WhatsAppShareProps) {
  const url = `${BRAND.whatsapp}?text=${encodeURIComponent(text)}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <Button
        variant={variant}
        size={size}
        className={cn("gap-2 bg-green-600 hover:bg-green-700 text-white", className)}
      >
        <MessageCircle className="h-4 w-4" />
        {label}
      </Button>
    </a>
  );
}

export function WhatsAppContact({
  label = "Chat on WhatsApp",
  variant = "outline",
  size = "default",
  className,
  message,
}: {
  label?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  className?: string;
  message?: string;
}) {
  const defaultMsg = message || `Hi ${BRAND.name}, I'm interested in your CCTV products. Please share more details.`;
  const url = `${BRAND.whatsapp}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={cn("inline-block", className)}>
      <Button variant={variant} size={size} className="gap-2 text-green-700 border-green-300 hover:bg-green-50">
        <MessageCircle className="h-4 w-4" />
        {label}
      </Button>
    </a>
  );
}
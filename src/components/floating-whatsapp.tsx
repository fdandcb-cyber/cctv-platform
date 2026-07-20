"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [tooltip, setTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (tooltip) {
      const timer = setTimeout(() => setTooltip(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [tooltip]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-end gap-3"
          )}
        >
          {/* Tooltip */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={cn(
                  "hidden sm:block bg-card border rounded-xl shadow-lg p-3 max-w-[200px]"
                )}
              >
                <p className={cn("text-sm font-medium")}>Need help?</p>
                <p className={cn("text-xs text-muted-foreground mt-0.5")}>
                  Chat with us on WhatsApp for instant support
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dismiss button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            className={cn(
              "absolute -top-2 -right-2 z-10",
              "h-5 w-5 rounded-full bg-muted-foreground/80 text-background",
              "flex items-center justify-center",
              "hover:bg-muted-foreground transition-colors"
            )}
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/917809465102?text=Hi%2C%20I%20am%20interested%20in%20CCTV%20solutions"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center",
              "h-14 w-14 rounded-full",
              "bg-green-500 text-white shadow-lg shadow-green-500/30",
              "hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/40",
              "active:scale-95",
              "transition-all duration-200"
            )}
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-6 w-6" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
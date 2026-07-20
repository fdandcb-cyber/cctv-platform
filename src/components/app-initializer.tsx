"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { useStore } from "@/store/cctv-store";

export function AppInitializer() {
  const restoreSession = useAppStore((s) => s.restoreSession);
  const setLoading = useStore((s) => s.setLoading);
  const setProducts = useStore((s) => s.setProducts);

  useEffect(() => {
    restoreSession();
    setLoading(true);
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restoreSession, setLoading, setProducts]);

  return null;
}
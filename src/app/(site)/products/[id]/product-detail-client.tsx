"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore, type CctvProduct } from "@/store/cctv-store";
import { ProductDetailPage } from "@/components/pages/product-detail-page";
import { Button } from "@/components/ui/button";
import { Camera, ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function ProductDetailClient() {
  const params = useParams();
  const productId = params.id as string;
  const { products, setSelectedProduct, setLoading, loading } = useStore();
  const [notFound, setNotFound] = useState(false);

  const product = products.find((p) => p.id === productId);

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
      fetch("/api/products")
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            useStore.getState().setProducts(data.data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p.id === productId);
      if (found) {
        setSelectedProduct(found);
      } else {
        setNotFound(true);
      }
    }
  }, [productId, products, setSelectedProduct]);

  if (notFound) {
    return (
      <div className="text-center py-16">
        <Camera className="h-14 w-14 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Product not found</h3>
        <p className="text-muted-foreground text-sm mb-4">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link href="/products">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <ProductDetailPage />;
}
"use client";

import { useEffect, useState } from "react";
import { CollectionProductList } from "@/components/collection-product-list";
import { mapApiProductsToProducts } from "@/lib/map-api-products";
import { productService } from "@/service/productService";
import type { Product } from "@/types";

interface CollectionProductsProps {
  category: string;
}

export function CollectionProducts({ category }: CollectionProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    productService
      .getByCategory(category)
      .then((response) => {
        if (cancelled) return;
        setProducts(mapApiProductsToProducts(response, category));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (loading) {
    return (
      <p className="text-center text-neutral-500 py-12 text-sm uppercase tracking-widest">
        Loading products…
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-neutral-600 py-16">
        Could not load products. Please try again later.
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-center text-neutral-600 py-16">
        No products in this collection yet. Check back soon.
      </p>
    );
  }

  return <CollectionProductList products={products} />;
}

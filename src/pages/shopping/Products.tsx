// src/pages/Products.tsx (With Slider Filter)

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "@/services/ecommerce/productService";
import type { ProductCategory } from "@/services/ecommerce/productService";
import ProductCard from "@/components/ui/feature/ProductCard";
import { Button } from "@/components/ui/buttons/button";
import { Input } from "@/components/ui/forms/input";
import { Slider } from "@/components/ui/utils/slider"; // Import Slider
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
import ActualBrandSlider from "@/components/ui/feature/ActualBrandSlider";
import ProductCardSkeleton from "@/components/ui/feature/ProductCardSkeleton";

// Helper for formatting currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const Products = () => {
  const { category: categorySlugFromUrl } = useParams<{ category?: string }>();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [sortOption, setSortOption] = useState<string>("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Price filter state
  const MAX_PRICE = 100000; // Define a max price for the slider
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<[number, number]>([0, MAX_PRICE]);

  // --- DATA FETCHING ---
  const { data: categories, isLoading: isLoadingCategories } = useQuery<
    ProductCategory[]
  >({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    data: paginatedProducts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "products",
      {
        category: categorySlugFromUrl,
        sort: sortOption,
        search: debouncedSearchTerm,
        min_price: debouncedPriceRange[0],
        max_price: debouncedPriceRange[1] === MAX_PRICE ? '' : debouncedPriceRange[1], // Don't send max price if it's the default max
      },
    ],
    queryFn: () =>
      fetchProducts({
        category: categorySlugFromUrl,
        sort: sortOption,
        search: debouncedSearchTerm,
        min_price: debouncedPriceRange[0].toString(),
        max_price: debouncedPriceRange[1] === MAX_PRICE ? undefined : debouncedPriceRange[1].toString(),
      }),
    keepPreviousData: true,
  });

  const products = paginatedProducts?.data || [];

  // --- EFFECTS ---
  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Debounce price range
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 600); // A slightly longer delay for the slider
    return () => clearTimeout(handler);
  }, [priceRange]);

  // --- HANDLERS ---
  const handleCategoryChange = (categorySlug: string | undefined) => {
    navigate(categorySlug ? `/products/category/${categorySlug}` : "/products");
  };

  // --- RENDER ---
  if (isError) {
    return (
      <div className="text-center py-20 text-destructive">
        Terjadi kesalahan: {error?.message}
      </div>
    );
  }

  const activeCategory = categories?.find(
    (cat) => cat.slug === categorySlugFromUrl
  );

  return (
    <div className="min-h-screen flex flex-col pt-16 bg-background">
      <main className="flex-grow py-8">
        <div className="container pb-44">
          <h1 className="text-3xl font-medium mb-8 text-foreground">
            {activeCategory ? activeCategory.name : "Semua Produk"}
          </h1>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* --- SIDEBAR FILTERS --- */}
            <div className="lg:w-1/4">
              {/* Category Filter */}
              <div className="bg-card p-6 rounded-lg border border-border mb-6">
                <h2 className="text-lg font-medium mb-4 text-foreground">Kategori</h2>
                <div className="space-y-2">
                  <Button
                    variant={!categorySlugFromUrl ? "default" : "ghost"}
                    onClick={() => handleCategoryChange(undefined)}
                    className={`w-full justify-start text-left ${!categorySlugFromUrl ? "bg-primary text-primary-foreground" : ""
                      }`}
                  >
                    Semua Produk
                  </Button>
                  {isLoadingCategories ? (
                    <p>Memuat kategori...</p>
                  ) : (
                    categories?.map((cat) => (
                      <Button
                        key={cat.id}
                        variant={
                          categorySlugFromUrl === cat.slug ? "default" : "ghost"
                        }
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={`w-full justify-start text-left ${categorySlugFromUrl === cat.slug
                          ? "bg-primary text-primary-foreground"
                          : ""
                          }`}
                      >
                        {cat.name}
                      </Button>
                    ))
                  )}
                </div>
              </div>

              {/* Price Filter with Slider */}
              <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-lg font-medium mb-4 text-foreground">Filter Harga</h2>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={MAX_PRICE}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(priceRange[0])}</span>
                    <span>{formatCurrency(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- PRODUCT LIST --- */}
            <div className="lg:w-3/4">
              {/* Search and Sort Controls */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <Input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:max-w-xs"
                />
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <span className="text-muted-foreground whitespace-nowrap">Urutkan:</span>
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Pilih Urutan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Terbaru</SelectItem>
                      <SelectItem value="price_asc">Harga: Terendah</SelectItem>
                      <SelectItem value="price_desc">Harga: Tertinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Menampilkan {paginatedProducts?.meta?.total || 0} produk
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {isLoading ? (
                  Array.from({ length: 9 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <div key={product.id} className="animate-fade-in">
                      <ProductCard product={product} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center">
                    <p className="text-lg text-muted-foreground">
                      Produk tidak ditemukan. Coba ubah filter Anda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <ActualBrandSlider />
      </main>
    </div>
  );
};

export default Products;

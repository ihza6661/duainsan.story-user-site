// src/services/productService.ts (Sesuai API v1.1.0)

import apiClient from "@/lib/api";

// =================================================================================
// --- DEFINISI TIPE DATA (SESUAI DOKUMENTASI OPENAPI v1.1.0) ---
// =================================================================================

/**
 * Mendefinisikan struktur data untuk Kategori Produk.
 * ✅ BENAR: `image` telah ditambahkan.
 */
export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

/**
 * Mendefinisikan struktur data untuk Gambar Produk.
 * ✅ BENAR: Properti sekarang adalah `image`.
 */
export interface ProductImage {
  id: number;
  image: string; // Sebelumnya `url` atau `image_url`
  alt_text: string | null;
  is_featured: boolean;
}

/**
 * [BARU] Mendefinisikan nilai atribut tunggal.
 * Contoh: "Merah", atau "Ukuran M".
 */
export interface AttributeValue {
  id: number;
  value: string;
}

/**
 * [BARU] Mendefinisikan Varian Produk yang spesifik.
 * Sebuah varian adalah kombinasi dari beberapa pilihan (AttributeValue)
 * dan memiliki harga serta stok sendiri.
 */
export interface ProductVariant {
  id: number;
  price: number;
  stock: number;
  options: AttributeValue[];
  images: ProductImage[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  featured_image: ProductImage | null;
}

export interface PaginatedProducts {
  data: Product[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ProductDetail extends Product {
  description: string;
  min_order_quantity: number;
  category: ProductCategory;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductDetailResponse {
    data: ProductDetail
}

interface FetchProductsParams {
  category?: string;
  search?: string;
  sort?: string;
  min_price?: string;
  max_price?: string;
}

/**
 * Mengambil daftar semua kategori produk dari API.
 */
export const fetchCategories = async (): Promise<ProductCategory[]> => {
  const response = await apiClient.get<{ data: ProductCategory[] }>("/customer/product-categories");
  return response.data.data;
};

/**
 * Mengambil daftar produk dari API, mendukung filter dan paginasi.
 */
export const fetchProducts = async (params: FetchProductsParams): Promise<PaginatedProducts> => {
  const response = await apiClient.get<PaginatedProducts>("/customer/products", {
    params: params,
  });
  return response.data;
};

/**
 * Mengambil data detail lengkap untuk satu produk berdasarkan ID-nya.
 */
export const fetchProductById = async (productId: string): Promise<ProductDetail> => {
  const response = await apiClient.get<ProductDetailResponse>(`/customer/products/${productId}`);
  return response.data.data;
};

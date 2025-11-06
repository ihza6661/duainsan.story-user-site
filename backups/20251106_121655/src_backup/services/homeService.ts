// src/services/homeService.ts

import apiClient from "@/lib/api";

// Mendefinisikan tipe data untuk respons API hero
export interface HeroData {
  title: string;
  subtitle: string;
  background_image_url: string;
  sample_image_url: string;
  whatsapp_number: string;
}

/**
 * Mengambil data untuk halaman hero dari API.
 */
export const fetchHeroData = async (): Promise<HeroData> => {
  const response = await apiClient.get<{ data: HeroData }>("/customer/hero-data");
  return response.data.data;
};
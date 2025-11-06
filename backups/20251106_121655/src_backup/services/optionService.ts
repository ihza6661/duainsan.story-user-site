// src/services/optionService.ts

import apiClient from "@/lib/api";

// Definisikan tipe data untuk Jenis Kertas
export interface PaperType {
  id: number;
  name: string; // Contoh: "Kertas Jasmine"
  value: string; // Contoh: "jasmine"
}

/**
 * Mengambil daftar semua jenis kertas yang tersedia dari API.
 */
export const fetchPaperTypes = async (): Promise<PaperType[]> => {
  // Asumsi endpoint ini ada di backend Anda
  const response = await apiClient.get<{ data: PaperType[] }>("/paper-types");
  return response.data.data;
};
// src/hooks/useRegister.ts

import { useState } from "react";
import { AxiosError } from "axios"; // Mengimpor tipe error dari Axios untuk penanganan yang lebih baik.
import { registerUser, RegisterPayload } from "@/services/auth/authService";

/**
 * Interface untuk mendefinisikan struktur objek error validasi
 * yang dikirim oleh backend (umumnya pada response status 422).
 * Contoh: { email: ["The email has already been taken."], password: ["..."] }
 */
interface ValidationErrors {
  [field: string]: string[];
}

/**
 * Custom hook `useRegister` untuk mengenkapsulasi semua logika
 * yang terkait dengan proses registrasi pengguna.
 */
export const useRegister = () => {
  // State untuk melacak status loading dari panggilan API.
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk menyimpan pesan error umum (error server atau network).
  const [error, setError] = useState<string | null>(null);

  // State khusus untuk menyimpan error validasi per-field dari API.
  const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null);

  // State untuk menyimpan pesan sukses setelah registrasi berhasil.
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Fungsi yang akan dieksekusi untuk memulai proses registrasi.
   * Dibungkus dalam satu fungsi agar bisa dipanggil dari komponen UI.
   * @param data - Payload data registrasi dari form.
   */
  const performRegister = async (data: RegisterPayload) => {
    // 1. Reset semua state sebelum memulai request baru untuk membersihkan UI.
    setIsLoading(true);
    setError(null);
    setValidationErrors(null);
    setSuccessMessage(null);

    try {
      // 2. Memanggil fungsi service untuk berinteraksi dengan API.
      const response = await registerUser(data);
      // Jika berhasil, atur pesan sukses dari response API.
      setSuccessMessage(response.message || "Registrasi berhasil! Silakan login.");
interface ErrorResponse {
  message: string;
  errors?: ValidationErrors;
}

// ... (keep the existing code)

    } catch (err) {
      // 3. Menangkap error yang dilempar oleh Axios jika response status bukan 2xx.
      const error = err as AxiosError<ErrorResponse>; // Type casting untuk akses properti error.
      
      if (error.response) {
        // Jika error memiliki 'response', berarti error berasal dari server.
        if (error.response.status === 422 && error.response.data.errors) {
          // Status 422 (Unprocessable Entity) khusus untuk error validasi.
          setValidationErrors(error.response.data.errors);
          setError("Data yang diberikan tidak valid. Silakan periksa kembali isian Anda.");
        } else {
          // Untuk error server lainnya (500, 404, dll.).
          setError(error.response.data.message || "Terjadi kesalahan pada server.");
        }
      } else {
        // Jika tidak ada 'response', berarti masalah network (misal, tidak ada koneksi).
        setError("Gagal menghubungi server. Periksa koneksi internet Anda.");
      }
    } finally {
      // 4. Apapun hasilnya (sukses atau gagal), hentikan status loading.
      setIsLoading(false);
    }
  };

  // 5. Kembalikan semua state dan fungsi yang dibutuhkan oleh komponen UI.
  return { isLoading, error, validationErrors, successMessage, performRegister };
};

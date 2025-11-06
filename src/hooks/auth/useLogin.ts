// src/hooks/useLogin.ts (Versi Perbaikan)

import { useState } from "react";
import { AxiosError } from "axios";
import { useAuth } from "@/context/useAuth"; // <-- 1. Impor useAuth
import { loginUser, LoginPayload } from "@/services/auth/authService";

interface ErrorResponse {
  message: string;
}

/**
 * Custom hook `useLogin` yang sekarang terintegrasi dengan AuthContext.
 * Tugasnya hanya menangani proses API call dan state loading/error lokal,
 * lalu menyerahkan data ke AuthContext.
 */
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 2. Dapatkan fungsi `login` dari konteks global
  const { login } = useAuth();

  const performLogin = async (credentials: LoginPayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser(credentials);
      const { user, token } = response.data;

      // 3. PANGGIL FUNGSI LOGIN DARI KONTEKS!
      // Ini adalah langkah kunci yang akan memperbarui state global.
      login(token, user);

      // Mengembalikan true untuk menandakan login berhasil.
      return true;

    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      if (error.response) {
        setError(error.response.data.message || "Email atau password salah.");
      } else {
        setError("Gagal menghubungi server. Periksa koneksi internet Anda.");
      }
      // Mengembalikan false untuk menandakan login gagal.
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // State `loggedInUser` sudah tidak diperlukan di sini karena sudah ada di AuthContext
  return { isLoading, error, performLogin };
};

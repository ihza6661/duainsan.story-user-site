// src/services/authService.ts (Final & Corrected)

import apiClient from "../lib/api";

// ===================================================================
// --- DEFINISI TIPE (Bersih & Sesuai API) ---
// ===================================================================

/**
 * Tipe data inti untuk objek pengguna.
 */
export interface User {
  id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: "customer" | "admin";
  address?: string | null;
  city_id?: number | null;
  city_name?: string | null; // Changed from city_id
  province_name?: string | null; // Changed from province_id
  postal_code?: string | null;
}

// --- Payload untuk Permintaan API ---
export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number?: string;
}

export interface UpdateProfilePayload {
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
  city_name?: string; // Changed from city_id
  province_name?: string; // Changed from province_id
  postal_code?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// --- Tipe Data untuk Respons API (Pembungkus) ---
// Frontend harus selalu mengharapkan respons dalam format ini
// dan mengambil data dari properti 'data'.
interface ApiResponse<T> {
  message: string;
  data: T;
}

// Tipe khusus untuk respons login
interface LoginApiResponse {
  message: string;
  data: {
    user: User;
    token: string;
  };
}


// ===================================================================
// --- FUNGSI-FUNGSI API ---
// ===================================================================

/**
 * Mengirim permintaan registrasi pengguna baru.
 */
export const registerUser = async (data: RegisterPayload): Promise<ApiResponse<User>> => {
  const response = await apiClient.post<ApiResponse<User>>("/register", data);
  return response.data;
};

/**
 * Mengirim permintaan login pengguna.
 */
export const loginUser = async (credentials: LoginPayload): Promise<LoginApiResponse> => {
  const response = await apiClient.post<LoginApiResponse>("/login", credentials);
  return response.data;
};

/**
 * Mengirim permintaan logout.
 */
export const logoutUser = async (): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>("/logout");
  return response.data;
};

/**
 * Mengambil data profil pengguna yang sedang login.
 * ✅ PERBAIKAN: Mengharap ApiResponse<User> dan mengembalikan response.data.data
 */
export const getMyProfile = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>("/user");
  return response.data.data;
};

/**
 * Memperbarui data profil pengguna yang sedang login.
 * ✅ PERBAIKAN: Mengharap ApiResponse<User> dan mengembalikan response.data
 */
export const updateProfile = async (payload: UpdateProfilePayload): Promise<ApiResponse<User>> => {
  const response = await apiClient.put<ApiResponse<User>>("/user", payload);
  return response.data;
};

/**
 * Mengubah password pengguna.
 */
export const changePassword = async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>("/user/change-password", payload);
  return response.data;
};
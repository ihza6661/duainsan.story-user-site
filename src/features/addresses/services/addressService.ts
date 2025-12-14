// src/features/addresses/services/addressService.ts

import apiClient from "@/lib/api";

/**
 * Address data type
 */
export interface Address {
  id: number;
  user_id: number;
  label: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  street: string;
  city: string;
  state: string;
  subdistrict?: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Payload for creating/updating address
 */
export interface AddressPayload {
  label?: string;
  recipient_name?: string;
  recipient_phone?: string;
  street: string;
  city: string;
  state: string;
  subdistrict?: string;
  postal_code: string;
  country?: string;
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  message: string;
  data: T;
}

/**
 * Get all user's addresses
 */
export async function getAddresses(): Promise<Address[]> {
  const response = await apiClient.get<ApiResponse<Address[]>>("/addresses");
  return response.data.data;
}

/**
 * Get single address by ID
 */
export async function getAddress(id: number): Promise<Address> {
  const response = await apiClient.get<ApiResponse<Address>>(`/addresses/${id}`);
  return response.data.data;
}

/**
 * Create new address
 */
export async function createAddress(payload: AddressPayload): Promise<Address> {
  const response = await apiClient.post<ApiResponse<Address>>("/addresses", payload);
  return response.data.data;
}

/**
 * Update existing address
 */
export async function updateAddress(
  id: number,
  payload: AddressPayload
): Promise<Address> {
  const response = await apiClient.put<ApiResponse<Address>>(
    `/addresses/${id}`,
    payload
  );
  return response.data.data;
}

/**
 * Delete address
 */
export async function deleteAddress(id: number): Promise<void> {
  await apiClient.delete(`/addresses/${id}`);
}

/**
 * Set address as default
 */
export async function setDefaultAddress(id: number): Promise<Address> {
  const response = await apiClient.post<ApiResponse<Address>>(
    `/addresses/${id}/set-default`
  );
  return response.data.data;
}

import apiClient from "../lib/api";

export interface Province {
  province_id: string;
  province: string;
}

export interface City {
  city_id: string;
  province_id: string;
  province: string;
  type: string;
  city_name: string;
  postal_code: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}

export const getProvinces = async (): Promise<Province[]> => {
  const response = await apiClient.get<ApiResponse<Province[]>>("/rajaongkir/provinces");
  return response.data.data;
};

export const getCities = async (provinceId: string): Promise<City[]> => {
  const response = await apiClient.get<ApiResponse<City[]>>(`/rajaongkir/cities?province_id=${provinceId}`);
  return response.data.data;
};
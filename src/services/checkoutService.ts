import api from '@/lib/api';

export const fetchProvinces = async () => {
  try {
    const response = await api.get('/rajaongkir/provinces');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCities = async (provinceId: string) => {
  try {
    const response = await api.get(`/rajaongkir/cities?province_id=${provinceId}`);
    console.log("RajaOngkir Cities API Response:", response.data); // Add this line

    // Check if the response contains an error from RajaOngkir
    if (response.data && response.data.rajaongkir && response.data.rajaongkir.status && response.data.rajaongkir.status.code !== 200) {
      console.warn("RajaOngkir API returned an error status:", response.data.rajaongkir.status.description);
      return []; // Return an empty array if RajaOngkir API indicates an error
    }

    if (response.data && response.data.rajaongkir && Array.isArray(response.data.rajaongkir.results)) {
      return response.data.rajaongkir.results;
    } else {
      // If the format is unexpected but not an explicit RajaOngkir error, log and return empty array
      console.error("Unexpected response format from RajaOngkir API:", response.data);
      return [];
    }
  } catch (error: any) {
    console.error("API call failed:", error.response?.data || error.message);
    // If there's a network error or other exception, return an empty array
    return [];
  }
};
/**
 * Mengirimkan data checkout ke server untuk pengguna yang terautentikasi.
 * @param checkoutData Data dari form checkout, harus dalam bentuk FormData.
 * @returns Respon dari server.
 */
export const createOrder = async (checkoutData: FormData) => {
  try {
    const response = await api.post('/checkout', checkoutData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mengirimkan data checkout ke server untuk tamu.
 * @param checkoutData Data dari form checkout, harus dalam bentuk FormData.
 * @returns Respon dari server.
 */
export const createGuestOrder = async (checkoutData: FormData) => {
  try {
    const sessionId = localStorage.getItem('cartSessionId');
    const headers: { [key: string]: string } = {
      'Content-Type': 'multipart/form-data',
    };
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }

    const response = await api.post('/guest-checkout', checkoutData, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getShippingCost = async (origin: string, destination: string, weight: number, courier: string) => {
  try {
    const response = await api.post('/rajaongkir/cost', {
      origin,
      destination,
      weight,
      courier,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

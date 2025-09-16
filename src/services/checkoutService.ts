import api from '@/lib/api';

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
    return response.data.data;
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
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

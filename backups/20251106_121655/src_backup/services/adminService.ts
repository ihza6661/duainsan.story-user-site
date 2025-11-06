// src/services/adminService.ts

import apiClient from "@/lib/api";

export interface ProductImage {
    id: number;
    image: string;
    alt_text: string | null;
    is_featured: boolean;
}

interface UploadImagePayload {
    image: File;
    is_featured: boolean;
}

/**
 * Mengunggah gambar baru untuk sebuah varian produk.
 */
export const uploadProductImage = async (variantId: number, payload: UploadImagePayload): Promise<ProductImage> => {
    const formData = new FormData();
    formData.append('image', payload.image);
    formData.append('is_featured', payload.is_featured ? '1' : '0');

    const response = await apiClient.post<{ data: ProductImage }>(`/admin/variants/${variantId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};
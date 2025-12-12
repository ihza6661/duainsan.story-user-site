import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface UGCItem {
  id: number;
  user_id: number;
  product_id: number | null;
  order_id: number | null;
  digital_invitation_id: number | null;
  image_path: string;
  image_url: string;
  caption: string | null;
  instagram_url: string | null;
  instagram_handle: string | null;
  is_approved: boolean;
  is_featured: boolean;
  approved_at: string | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
  product?: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface UGCPaginatedResponse {
  message: string;
  data: {
    current_page: number;
    data: UGCItem[];
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface SubmitUGCPayload {
  image: File;
  caption?: string;
  instagram_url?: string;
  instagram_handle?: string;
  product_id?: number;
  order_id?: number;
  digital_invitation_id?: number;
}

const ugcService = {
  /**
   * Get approved UGC (public)
   */
  async getApproved(params?: {
    page?: number;
    per_page?: number;
    product_id?: number;
    featured?: boolean;
  }): Promise<UGCPaginatedResponse> {
    const response = await axios.get(`${API_URL}/v1/customer/ugc`, { params });
    return response.data;
  },

  /**
   * Submit new UGC (authenticated)
   */
  async submit(payload: SubmitUGCPayload): Promise<{ message: string; data: UGCItem }> {
    const formData = new FormData();
    formData.append("image", payload.image);
    if (payload.caption) formData.append("caption", payload.caption);
    if (payload.instagram_url) formData.append("instagram_url", payload.instagram_url);
    if (payload.instagram_handle) formData.append("instagram_handle", payload.instagram_handle);
    if (payload.product_id) formData.append("product_id", payload.product_id.toString());
    if (payload.order_id) formData.append("order_id", payload.order_id.toString());
    if (payload.digital_invitation_id) formData.append("digital_invitation_id", payload.digital_invitation_id.toString());

    const response = await axios.post(`${API_URL}/v1/ugc`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Get user's own submissions (authenticated)
   */
  async getMySubmissions(params?: { page?: number; per_page?: number }): Promise<UGCPaginatedResponse> {
    const response = await axios.get(`${API_URL}/v1/ugc/my-submissions`, { params });
    return response.data;
  },

  /**
   * Delete user's own UGC (authenticated)
   */
  async delete(id: number): Promise<{ message: string }> {
    const response = await axios.delete(`${API_URL}/v1/ugc/${id}`);
    return response.data;
  },
};

export default ugcService;

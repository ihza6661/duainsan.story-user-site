import { apiClient } from "@/lib/api";

export interface InvitationTemplate {
  id: number;
  slug: string;
  name: string;
  description: string;
  thumbnail_image: string;
  price: number;
  template_component: string;
  usage_count: number;
}

export interface DigitalInvitation {
  id: number;
  order_id: number;
  slug: string;
  status: "draft" | "active" | "expired";
  public_url: string;
  view_count: number;
  expires_at: string | null;
  is_expired: boolean;
  template: {
    id: number;
    name: string;
    slug: string;
    thumbnail_image: string;
  };
  order: {
    order_number: string;
    status: string;
  };
  customization_data: {
    bride_name?: string;
    groom_name?: string;
    event_date?: string;
    event_time?: string;
    venue_name?: string;
    venue_address?: string;
    venue_map_url?: string;
    additional_info?: string;
    photo_urls?: string[];
    custom_fields?: Record<string, any>;
    has_photos?: boolean;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface CustomizationData {
  bride_name?: string;
  groom_name?: string;
  event_date?: string;
  event_time?: string;
  venue_name?: string;
  venue_address?: string;
  venue_map_url?: string;
  additional_info?: string;
  custom_fields?: Record<string, any>;
}

export const digitalInvitationService = {
  /**
   * Get all invitation templates (public)
   */
  async getTemplates(): Promise<InvitationTemplate[]> {
    const response = await apiClient.get("/v1/customer/invitation-templates");
    return response.data.data;
  },

  /**
   * Get template by slug (public)
   */
  async getTemplateBySlug(slug: string): Promise<InvitationTemplate> {
    const response = await apiClient.get(
      `/v1/customer/invitation-templates/${slug}`
    );
    return response.data.data;
  },

  /**
   * Get user's digital invitations (auth required)
   */
  async getMyInvitations(): Promise<DigitalInvitation[]> {
    const response = await apiClient.get("/v1/digital-invitations");
    return response.data.data;
  },

  /**
   * Get invitation detail by ID (auth required)
   */
  async getInvitationById(id: number): Promise<DigitalInvitation> {
    const response = await apiClient.get(`/v1/digital-invitations/${id}`);
    return response.data.data;
  },

  /**
   * Update invitation customization (auth required)
   */
  async updateCustomization(
    id: number,
    data: CustomizationData
  ): Promise<void> {
    await apiClient.put(`/v1/digital-invitations/${id}/customize`, data);
  },

  /**
   * Upload photo to invitation (auth required)
   */
  async uploadPhoto(id: number, file: File): Promise<{ photo_url: string }> {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await apiClient.post(
      `/v1/digital-invitations/${id}/photos`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  },

  /**
   * Delete photo from invitation (auth required)
   */
  async deletePhoto(id: number, photoIndex: number): Promise<void> {
    await apiClient.delete(
      `/v1/digital-invitations/${id}/photos/${photoIndex}`
    );
  },

  /**
   * Activate invitation (auth required)
   */
  async activate(
    id: number
  ): Promise<{ public_url: string; status: string }> {
    const response = await apiClient.post(
      `/v1/digital-invitations/${id}/activate`
    );
    return response.data.data;
  },

  /**
   * Deactivate invitation (auth required)
   */
  async deactivate(id: number): Promise<{ status: string }> {
    const response = await apiClient.post(
      `/v1/digital-invitations/${id}/deactivate`
    );
    return response.data.data;
  },

  /**
   * View public invitation (no auth)
   */
  async viewPublicInvitation(slug: string): Promise<{
    template: {
      name: string;
      template_component: string;
    };
    customization: CustomizationData;
    view_count: number;
    slug: string;
  }> {
    const response = await apiClient.get(`/v1/invitations/${slug}`);
    return response.data.data;
  },
};

import apiClient from "@/lib/api";

export interface InvitationTemplate {
  id: number;
  product_id: number;
  slug: string;
  name: string;
  description: string;
  thumbnail_image: string;
  price: number;
  template_component: string;
  usage_count: number;
}

export interface TemplateField {
  id: number;
  field_key: string;
  field_label: string;
  field_type: 'text' | 'textarea' | 'date' | 'time' | 'url' | 'email' | 'phone' | 'image' | 'color';
  field_category: 'couple' | 'event' | 'venue' | 'design' | 'general';
  placeholder: string | null;
  default_value: string | null;
  validation_rules: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  help_text: string | null;
  display_order: number;
}

export interface TemplateFieldsResponse {
  template_id: number;
  template_name: string;
  has_custom_fields: boolean;
  fields: TemplateField[];
  grouped_fields: Record<string, TemplateField[]>;
}

export interface DigitalInvitation {
  id: number;
  order_id: number;
  slug: string;
  status: "draft" | "active" | "expired";
  public_url: string;
  view_count: number;
  expires_at: string | null;
  scheduled_activation_at: string | null;
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
    photo_urls?: Array<{ url: string; type?: 'bride' | 'groom' | null }>;
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
  photo_paths?: string[];
  custom_fields?: Record<string, any>;
}

export interface ColorTheme {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textMuted: string;
}

export const digitalInvitationService = {
  /**
   * Get all invitation templates (public)
   */
  async getTemplates(): Promise<InvitationTemplate[]> {
    const response = await apiClient.get("/customer/invitation-templates");
    return response.data.data;
  },

  /**
   * Get template by slug (public)
   */
  async getTemplateBySlug(slug: string): Promise<InvitationTemplate> {
    const response = await apiClient.get(
      `/customer/invitation-templates/${slug}`
    );
    return response.data.data;
  },

  /**
   * Get template customization fields (public)
   */
  async getTemplateFields(templateId: number): Promise<TemplateFieldsResponse> {
    const response = await apiClient.get(
      `/customer/invitation-templates/${templateId}/fields`
    );
    return response.data.data;
  },

  /**
   * Get user's digital invitations (auth required)
   */
  async getMyInvitations(): Promise<DigitalInvitation[]> {
    const response = await apiClient.get("/digital-invitations");
    return response.data.data;
  },

  /**
   * Get invitation detail by ID (auth required)
   */
  async getInvitationById(id: number): Promise<DigitalInvitation> {
    const response = await apiClient.get(`/digital-invitations/${id}`);
    return response.data.data;
  },

  /**
   * Update invitation customization (auth required)
   */
  async updateCustomization(
    id: number,
    data: CustomizationData
  ): Promise<void> {
    await apiClient.put(`/digital-invitations/${id}/customize`, data);
  },

  /**
   * Upload photo to invitation (auth required)
   */
  async uploadPhoto(id: number, file: File, photoType?: 'bride' | 'groom'): Promise<{ photo_url: string; photo_type?: string }> {
    const formData = new FormData();
    formData.append("photo", file);
    if (photoType) {
      formData.append("photo_type", photoType);
    }

    const response = await apiClient.post(
      `/digital-invitations/${id}/photos`,
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
      `/digital-invitations/${id}/photos/${photoIndex}`
    );
  },

  /**
   * Activate invitation (auth required)
   */
  async activate(
    id: number
  ): Promise<{ public_url: string; status: string }> {
    const response = await apiClient.post(
      `/digital-invitations/${id}/activate`
    );
    return response.data.data;
  },

  /**
   * Deactivate invitation (auth required)
   */
  async deactivate(id: number): Promise<{ status: string }> {
    const response = await apiClient.post(
      `/digital-invitations/${id}/deactivate`
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
    const response = await apiClient.get(`/invitations/${slug}`);
    return response.data.data;
  },

  /**
   * Export invitation as PDF (auth required)
   * Downloads PDF file directly
   */
  async exportPdf(id: number): Promise<void> {
    const response = await apiClient.get(
      `/digital-invitations/${id}/export/pdf`,
      {
        responseType: "blob",
      }
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invitation-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  /**
   * Save PDF to server and get URL (auth required)
   */
  async savePdf(id: number): Promise<{ path: string; url: string }> {
    const response = await apiClient.post(
      `/digital-invitations/${id}/export/save-pdf`
    );
    return response.data.data;
  },

  /**
   * Get export statistics (auth required)
   */
  async getExportStats(id: number): Promise<{
    total_exports: number;
    last_export_at: string | null;
    export_files: Array<{
      path: string;
      url: string;
      size: number;
      modified_at: number;
    }>;
  }> {
    const response = await apiClient.get(
      `/digital-invitations/${id}/export/stats`
    );
    return response.data.data;
  },

  /**
   * Get PDF metadata preview (auth required)
   */
  async getPdfMetadata(id: number): Promise<{
    title: string;
    author: string;
    subject: string;
    keywords: string;
  }> {
    const response = await apiClient.get(
      `/digital-invitations/${id}/export/pdf-metadata`
    );
    return response.data.data;
  },

  /**
   * Get available color themes for a template (public)
   */
  async getTemplateColorThemes(templateId: number): Promise<{
    template_id: number;
    template_name: string;
    color_themes: Record<string, ColorTheme>;
  }> {
    const response = await apiClient.get(
      `/customer/invitation-templates/${templateId}/color-themes`
    );
    return response.data.data;
  },

  /**
   * Get current color theme for invitation (auth required)
   */
  async getCurrentColorTheme(id: number): Promise<{
    invitation_id: number;
    theme_key: string;
    theme: ColorTheme;
    available_themes: Record<string, ColorTheme>;
  }> {
    const response = await apiClient.get(
      `/digital-invitations/${id}/color-theme`
    );
    return response.data.data;
  },

  /**
   * Apply color theme to invitation (auth required)
   */
  async applyColorTheme(
    id: number,
    themeKey: string
  ): Promise<{
    invitation_id: number;
    theme_key: string;
    theme: ColorTheme;
  }> {
    const response = await apiClient.post(
      `/digital-invitations/${id}/color-theme`,
      { theme_key: themeKey }
    );
    return response.data.data;
  },

  /**
   * Schedule activation for future date/time (auth required)
   */
  async scheduleActivation(
    id: number,
    scheduledAt: string
  ): Promise<{
    scheduled_activation_at: string;
    status: string;
  }> {
    const response = await apiClient.post(
      `/digital-invitations/${id}/schedule-activation`,
      { scheduled_at: scheduledAt }
    );
    return response.data.data;
  },

  /**
   * Cancel scheduled activation (auth required)
   */
  async cancelScheduledActivation(id: number): Promise<{ status: string }> {
    const response = await apiClient.delete(
      `/digital-invitations/${id}/schedule-activation`
    );
    return response.data.data;
  },

  /**
   * Update invitation slug/URL (auth required)
   */
  async updateSlug(
    id: number,
    slug: string
  ): Promise<{
    slug: string;
    public_url: string;
    old_slug: string;
  }> {
    const response = await apiClient.put(
      `/digital-invitations/${id}/slug`,
      { slug }
    );
    return response.data.data;
  },

  /**
   * Get preview data for invitation (auth required)
   * Works even if invitation is not active
   */
  async getPreviewData(id: number): Promise<{
    template: {
      name: string;
      template_component: string;
    };
    customization: CustomizationData;
    view_count: number;
    slug: string;
    colorTheme?: {
      key: string;
      name: string;
      colors: ColorTheme;
    };
    is_preview: boolean;
  }> {
    const response = await apiClient.get(`/digital-invitations/${id}/preview`);
    return response.data;
  },
};


import apiClient from '@/lib/api';

export interface GalleryItem {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
}

interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export const fetchGalleryItems = async ({ pageParam = '/customer/gallery-items' }: { pageParam?: string }) => {
  const response = await apiClient.get<PaginatedResponse<GalleryItem>>(pageParam);
  return response.data;
};

import api from '@/lib/api';

export interface Notification {
  id: number;
  user_id: number;
  type: 'order_status' | 'design_proof' | 'payment' | 'cancellation' | 'digital_invitation_ready';
  title: string;
  message: string;
  data: Record<string, string | number | boolean | null> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationsResponse {
  message: string;
  data: {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UnreadCountResponse {
  message: string;
  data: {
    unread_count: number;
  };
}

/**
 * Get all notifications for the authenticated user
 */
export const getNotifications = async (page: number = 1, perPage: number = 20): Promise<NotificationsResponse> => {
  const response = await api.get('/notifications', {
    params: { page, per_page: perPage },
  });
  return response.data;
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (notificationId: number): Promise<{ message: string }> => {
  const response = await api.post(`/notifications/${notificationId}/mark-as-read`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<{ message: string; data: { updated_count: number } }> => {
  const response = await api.post('/notifications/mark-all-read');
  return response.data;
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type: string): string => {
  const icons = {
    order_status: '📦',
    design_proof: '🎨',
    payment: '💳',
    cancellation: '❌',
    digital_invitation_ready: '💌',
  };
  return icons[type as keyof typeof icons] || '🔔';
};

/**
 * Get notification color based on type
 */
export const getNotificationColor = (type: string): string => {
  const colors = {
    order_status: 'text-blue-600 dark:text-blue-400',
    design_proof: 'text-purple-600 dark:text-purple-400',
    payment: 'text-green-600 dark:text-green-400',
    cancellation: 'text-red-600 dark:text-red-400',
    digital_invitation_ready: 'text-pink-600 dark:text-pink-400',
  };
  return colors[type as keyof typeof colors] || 'text-gray-600 dark:text-gray-400';
};

/**
 * Format notification time (relative)
 */
export const formatNotificationTime = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Baru saja';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} menit yang lalu`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} jam yang lalu`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} hari yang lalu`;
  } else {
    return created.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
};

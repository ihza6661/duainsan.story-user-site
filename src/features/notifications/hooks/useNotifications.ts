import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../services/notificationService';

/**
 * Hook to fetch notifications with polling
 */
export const useNotifications = (page: number = 1, perPage: number = 20) => {
  return useQuery({
    queryKey: ['notifications', page, perPage],
    queryFn: () => getNotifications(page, perPage),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Poll every 60 seconds
  });
};

/**
 * Hook to fetch unread count with frequent polling
 */
export const useUnreadCount = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadCount,
    enabled,
    staleTime: 1000 * 15, // 15 seconds
    refetchInterval: 1000 * 30, // Poll every 30 seconds
    select: (data) => data.data.unread_count,
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // Invalidate both notifications list and unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      // Invalidate both notifications list and unread count
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

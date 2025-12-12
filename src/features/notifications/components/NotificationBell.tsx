import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import {
  useUnreadCount,
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "../hooks/useNotifications";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  formatNotificationTime,
  getNotificationIcon,
  getNotificationColor,
  type Notification,
} from "../services/notificationService";
import { Button } from "@/components/ui/buttons/button";

export const NotificationBell = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount } = useUnreadCount(!!user);
  const { data: notificationsData, isLoading } = useNotifications(1, 10);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = notificationsData?.data?.data || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type and data
    if (notification.data) {
      // Digital invitation ready notification
      if (notification.type === 'digital_invitation_ready' && notification.data.action_url) {
        window.location.href = notification.data.action_url;
      }
      // Order-related notifications
      else if (notification.data.order_id || notification.data.order_number) {
        const orderId = notification.data.order_id;
        if (orderId) {
          window.location.href = `/status-pesanan/${orderId}`;
        }
      }
      // Design proof notification
      else if (notification.type === 'design_proof' && notification.data.design_proof_id) {
        window.location.href = `/design-proofs/${notification.data.design_proof_id}`;
      }
    }

    setIsOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-8 h-10"
        aria-label="Notifications"
      >
        <Bell className="text-foreground te" />
        {(unreadCount ?? 0) > 0 && (
          <span className="absolute -top-1 sm:-top-2 -right-1 bg-secondary text-[10px] md:text-xs rounded-full h-4 w-3 md:h-5 md:w-4 flex items-center justify-center min-w-[30px] px-[2px]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 max-h-[500px] bg-popover border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-popover border-b border-border p-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifikasi</h3>
            {(unreadCount ?? 0) > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isPending}
                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[400px]">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">
                  Memuat notifikasi...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Tidak ada notifikasi
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`
                      w-full text-left p-4 hover:bg-muted/50 transition-colors
                      ${
                        !notification.is_read
                          ? "bg-primary-50/50 dark:bg-primary-900/10"
                          : ""
                      }
                    `}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`font-medium text-sm ${getNotificationColor(
                              notification.type
                            )}`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.is_read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {formatNotificationTime(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="sticky bottom-0 bg-popover border-t border-border p-3">
              <a
                href="/notifications"
                className="block text-center text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Lihat semua notifikasi
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

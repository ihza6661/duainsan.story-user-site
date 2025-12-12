import { useState } from "react";
import { Bell, Check, CheckCheck, Loader2 } from "lucide-react";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/features/notifications/hooks/useNotifications";
import {
  formatNotificationTime,
  getNotificationIcon,
  getNotificationColor,
  type Notification,
} from "@/features/notifications/services/notificationService";
import { Button } from "@/components/ui/buttons/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/utils/card";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data: notificationsData, isLoading } = useNotifications(page, 20);
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = notificationsData?.data?.data || [];
  const pagination = notificationsData?.data;
  const totalPages = pagination?.last_page || 1;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
      if (
        notification.type === "digital_invitation_ready" &&
        notification.data.action_url
      ) {
        navigate(notification.data.action_url);
      }
      // Order-related notifications
      else if (notification.data.order_id || notification.data.order_number) {
        const orderId = notification.data.order_id;
        if (orderId) {
          navigate(`/status-pesanan/${orderId}`);
        }
      }
      // Design proof notification
      else if (
        notification.type === "design_proof" &&
        notification.data.design_proof_id
      ) {
        navigate(`/design-proofs/${notification.data.design_proof_id}`);
      }
    }
  };

  return (
    <div className="min-h-screen py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-6 h-6" />
                Notifikasi
              </CardTitle>
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  disabled={markAllAsReadMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Tandai Semua Dibaca
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {unreadCount} notifikasi belum dibaca
              </p>
            )}
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Memuat notifikasi...
                </span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Tidak ada notifikasi</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`
                    w-full text-left p-4 rounded-lg border transition-all hover:shadow-md
                    ${
                      !notification.is_read
                        ? "bg-primary-50/50 dark:bg-primary-900/10 border-primary-200 dark:border-primary-800"
                        : "bg-card border-border hover:bg-muted/50"
                    }
                  `}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <span className="text-3xl">
                          {getNotificationIcon(notification.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3
                            className={`font-semibold text-base ${getNotificationColor(
                              notification.type,
                            )}`}
                          >
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.is_read && (
                              <span className="w-2 h-2 bg-primary rounded-full"></span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Tandai sebagai dibaca"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {formatNotificationTime(notification.created_at)}
                          </span>
                          {notification.data && (
                            <>
                              {notification.data.template_name && (
                                <span className="px-2 py-1 bg-muted rounded">
                                  {notification.data.template_name}
                                </span>
                              )}
                              {notification.data.order_number && (
                                <span className="px-2 py-1 bg-muted rounded">
                                  {notification.data.order_number}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t">
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || isLoading}
                  variant="outline"
                  size="sm"
                >
                  Sebelumnya
                </Button>
                <span className="text-sm text-muted-foreground">
                  Halaman {page} dari {totalPages}
                </span>
                <Button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages || isLoading}
                  variant="outline"
                  size="sm"
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

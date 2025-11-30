import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/utils/badge-variants";

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export type StatusInfo = {
  text: string;
  variant: BadgeVariant;
  textColor?: string;
};

const normalizeStatusKey = (status: string) =>
  status.toLowerCase().trim().replace(/\s+/g, "_");

const orderStatusMap: Record<string, StatusInfo> = {
  // Backend returns Title Case with spaces, normalized to snake_case keys
  pending_payment: { text: "Menunggu Pembayaran", variant: "secondary" },
  partially_paid: { text: "Dibayar Sebagian", variant: "secondary" },
  paid: { text: "Lunas", variant: "default" },
  processing: { text: "Sedang Diproses", variant: "default" },
  design_approval: { text: "Persetujuan Desain", variant: "default" },
  in_production: { text: "Dalam Produksi", variant: "default" },
  shipped: { text: "Telah Dikirim", variant: "default" },
  delivered: { text: "Telah Diterima", variant: "default" },
  completed: { text: "Selesai", variant: "default" },
  cancelled: { text: "Dibatalkan", variant: "destructive" },
  failed: { text: "Gagal", variant: "destructive" },
  refunded: { text: "Dikembalikan", variant: "destructive" },
  // Fallback aliases for backwards compatibility
  pending: { text: "Menunggu Pembayaran", variant: "secondary" },
  expired: { text: "Kedaluwarsa", variant: "destructive" },
};

const paymentStatusMap: Record<string, StatusInfo> = {
  pending: { text: "Menunggu Pembayaran", variant: "secondary" },
  pending_payment: { text: "Menunggu Pembayaran", variant: "secondary" },
  partially_paid: { text: "Dibayar Sebagian", variant: "secondary" },
  paid: { text: "Lunas", variant: "default" },
  processing: { text: "Sedang Diproses", variant: "default" },
  processing_payment: { text: "Sedang Diproses", variant: "default" },
  failed: { text: "Gagal", variant: "destructive" },
  expired: { text: "Kedaluwarsa", variant: "destructive" },
  cancelled: { text: "Dibatalkan", variant: "destructive" },
  unpaid: { text: "Belum Dibayar", variant: "secondary" },
};

const orderStatusFallback: StatusInfo = {
  text: "Status Tidak Diketahui",
  variant: "secondary",
};

const paymentStatusFallback: StatusInfo = {
  text: "Status Tidak Diketahui",
  variant: "secondary",
};

const getStatusInfoFromMap = (
  status: string | undefined,
  map: Record<string, StatusInfo>,
  fallback: StatusInfo,
): StatusInfo => {
  if (!status) {
    return fallback;
  }

  if (map[status]) {
    return map[status];
  }

  const lower = status.toLowerCase();
  if (map[lower]) {
    return map[lower];
  }

  const normalized = normalizeStatusKey(status);
  return map[normalized] ?? fallback;
};

export const getOrderStatusInfo = (status?: string) =>
  getStatusInfoFromMap(status, orderStatusMap, orderStatusFallback);

export const getPaymentStatusInfo = (status?: string) =>
  getStatusInfoFromMap(status, paymentStatusMap, paymentStatusFallback);

const paymentOptionLabels: Record<string, string> = {
  dp: "Down Payment (DP)",
  full: "Pembayaran Penuh",
  final: "Pelunasan Akhir",
};

export const getPaymentOptionLabel = (option?: string | null) =>
  option ? paymentOptionLabels[option] ?? option : "-";

export type { StatusInfo as PaymentStatusInfo };

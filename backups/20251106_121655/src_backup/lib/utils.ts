import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) {
    return "/placeholder.svg";
  }
  if (path.startsWith("http")) {
    return path;
  }
  const storageUrl = import.meta.env.VITE_PUBLIC_STORAGE_URL || "";
  return `${storageUrl}/${path}`;
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

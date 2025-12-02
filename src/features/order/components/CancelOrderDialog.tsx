import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialogs/dialog';
import { Button } from '@/components/ui/buttons/button';
import { Label } from '@/components/ui/forms/label';
import { Textarea } from '@/components/ui/forms/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/forms/select';
import { Alert, AlertDescription } from '@/components/ui/feedback/alert';
import { AlertCircle, InfoIcon } from 'lucide-react';

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
  orderNumber: string;
}

const CANCELLATION_REASONS = [
  'Berubah pikiran',
  'Menemukan harga lebih murah di tempat lain',
  'Pengiriman terlalu lama',
  'Salah memesan produk',
  'Masalah pembayaran',
  'Alasan pribadi',
  'Lainnya',
];

export function CancelOrderDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  orderNumber,
}: CancelOrderDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleConfirm = () => {
    const reason = selectedReason === 'Lainnya' ? customReason : selectedReason;

    if (!reason || reason.trim().length < 10) {
      setError('Alasan pembatalan minimal 10 karakter');
      return;
    }

    if (reason.trim().length > 500) {
      setError('Alasan pembatalan maksimal 500 karakter');
      return;
    }

    setError('');
    onConfirm(reason);
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedReason('');
      setCustomReason('');
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Batalkan Pesanan</DialogTitle>
          <DialogDescription>
            Anda akan membatalkan pesanan <strong>{orderNumber}</strong>. Harap
            berikan alasan pembatalan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Cancellation Policy Info */}
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Kebijakan Pembatalan:</strong>
              <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
                <li>Pesanan yang sudah dibayar hanya dapat dibatalkan dalam 24 jam</li>
                <li>Pengembalian dana diproses dalam 5-10 hari kerja</li>
                <li>Stok produk akan dikembalikan secara otomatis</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Reason Selection */}
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan Pembatalan *</Label>
            <Select
              value={selectedReason}
              onValueChange={(value) => {
                setSelectedReason(value);
                setError('');
              }}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih alasan pembatalan" />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Reason Textarea (shown if "Lainnya" is selected) */}
          {selectedReason === 'Lainnya' && (
            <div className="space-y-2">
              <Label htmlFor="custom-reason">Alasan Lainnya *</Label>
              <Textarea
                id="custom-reason"
                placeholder="Jelaskan alasan pembatalan Anda (minimal 10 karakter)"
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {customReason.length}/500 karakter
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading || !selectedReason}
          >
            {isLoading ? 'Memproses...' : 'Konfirmasi Pembatalan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

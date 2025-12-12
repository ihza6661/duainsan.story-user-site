import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Clock, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { Button } from "@/components/ui/buttons/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogs/dialog";
import { Calendar } from "@/components/ui/utils/calendar";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/dialogs/popover";
import { toast } from "@/hooks/ui/use-toast";
import { digitalInvitationService } from "@/features/digital-invitations/services/digitalInvitationService";
import { cn } from "@/lib/utils";

interface ScheduleActivationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invitationId: number;
  currentScheduledAt?: string | null;
}

export function ScheduleActivationDialog({
  open,
  onOpenChange,
  invitationId,
  currentScheduledAt,
}: ScheduleActivationDialogProps) {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    currentScheduledAt ? new Date(currentScheduledAt) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    currentScheduledAt
      ? format(new Date(currentScheduledAt), "HH:mm")
      : format(new Date(), "HH:mm")
  );
  const [validationError, setValidationError] = useState<string>("");

  // Schedule activation mutation
  const scheduleMutation = useMutation({
    mutationFn: (scheduledAt: string) =>
      digitalInvitationService.scheduleActivation(invitationId, scheduledAt),
    onSuccess: () => {
      toast({
        title: "Berhasil!",
        description: "Aktivasi undangan telah dijadwalkan.",
      });
      queryClient.invalidateQueries({ queryKey: ["invitation", String(invitationId)] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal menjadwalkan aktivasi",
        description: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  // Cancel scheduled activation mutation
  const cancelMutation = useMutation({
    mutationFn: () =>
      digitalInvitationService.cancelScheduledActivation(invitationId),
    onSuccess: () => {
      toast({
        title: "Berhasil!",
        description: "Jadwal aktivasi telah dibatalkan.",
      });
      queryClient.invalidateQueries({ queryKey: ["invitation", String(invitationId)] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal membatalkan jadwal",
        description: error.message || "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedDate(undefined);
    setSelectedTime(format(new Date(), "HH:mm"));
    setValidationError("");
  };

  const validateDateTime = (date: Date, time: string): boolean => {
    const [hours, minutes] = time.split(":").map(Number);
    const scheduledDateTime = new Date(date);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    const now = new Date();
    
    if (scheduledDateTime <= now) {
      setValidationError("Waktu aktivasi harus di masa depan");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSchedule = () => {
    if (!selectedDate) {
      setValidationError("Pilih tanggal terlebih dahulu");
      return;
    }

    if (!validateDateTime(selectedDate, selectedTime)) {
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    // Format to ISO 8601 for API
    const scheduledAt = scheduledDateTime.toISOString();
    scheduleMutation.mutate(scheduledAt);
  };

  const handleCancel = () => {
    cancelMutation.mutate();
  };

  const handleClose = () => {
    if (!scheduleMutation.isPending && !cancelMutation.isPending) {
      onOpenChange(false);
      resetForm();
    }
  };

  const isLoading = scheduleMutation.isPending || cancelMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Jadwalkan Aktivasi Undangan</DialogTitle>
          <DialogDescription>
            {currentScheduledAt
              ? "Perbarui atau batalkan jadwal aktivasi undangan Anda"
              : "Pilih tanggal dan waktu untuk mengaktifkan undangan secara otomatis"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Schedule Info */}
          {currentScheduledAt && (
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-1">Jadwal Saat Ini:</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(currentScheduledAt), "PPP 'pukul' HH:mm", {
                  locale: localeId,
                })}
              </p>
            </div>
          )}

          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: localeId })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Picker */}
          <div className="space-y-2">
            <Label htmlFor="time">Waktu</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="text-sm text-destructive">{validationError}</div>
          )}

          {/* Preview */}
          {selectedDate && selectedTime && !validationError && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-md">
              <p className="text-sm font-medium text-primary">
                Undangan akan aktif pada:
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {format(
                  new Date(
                    selectedDate.setHours(
                      ...selectedTime.split(":").map(Number),
                      0,
                      0
                    )
                  ),
                  "EEEE, dd MMMM yyyy 'pukul' HH:mm",
                  { locale: localeId }
                )}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {/* Cancel Schedule Button (if already scheduled) */}
          {currentScheduledAt && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Membatalkan...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Batalkan Jadwal
                </>
              )}
            </Button>
          )}

          {/* Close Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Tutup
          </Button>

          {/* Schedule Button */}
          <Button
            type="button"
            onClick={handleSchedule}
            disabled={isLoading || !selectedDate}
            className="w-full sm:w-auto"
          >
            {scheduleMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menjadwalkan...
              </>
            ) : (
              <>
                <CalendarIcon className="h-4 w-4 mr-2" />
                {currentScheduledAt ? "Perbarui Jadwal" : "Jadwalkan"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import { Textarea } from '@/components/ui/forms/textarea';
import { Label } from '@/components/ui/forms/label';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

type ActionType = 'approve' | 'reject' | 'revision';

interface ApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (action: ActionType, feedback?: string) => void;
  actionType: ActionType;
  isLoading?: boolean;
}

export const ApprovalDialog = ({
  isOpen,
  onClose,
  onSubmit,
  actionType,
  isLoading = false,
}: ApprovalDialogProps) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if ((actionType === 'reject' || actionType === 'revision') && !feedback.trim()) {
      return;
    }
    onSubmit(actionType, feedback.trim() || undefined);
    setFeedback('');
  };

  const getDialogConfig = () => {
    switch (actionType) {
      case 'approve':
        return {
          title: 'Setujui Desain',
          description: 'Anda yakin ingin menyetujui desain ini? Anda dapat memberikan catatan tambahan (opsional).',
          icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
          buttonText: 'Setujui Desain',
          buttonVariant: 'default' as const,
          feedbackRequired: false,
          feedbackLabel: 'Catatan (Opsional)',
          feedbackPlaceholder: 'Tambahkan catatan jika ada...',
        };
      case 'reject':
        return {
          title: 'Tolak Desain',
          description: 'Mohon berikan alasan penolakan desain ini.',
          icon: <XCircle className="h-6 w-6 text-red-600" />,
          buttonText: 'Tolak Desain',
          buttonVariant: 'destructive' as const,
          feedbackRequired: true,
          feedbackLabel: 'Alasan Penolakan *',
          feedbackPlaceholder: 'Jelaskan mengapa desain ini ditolak...',
        };
      case 'revision':
        return {
          title: 'Minta Revisi',
          description: 'Mohon jelaskan perubahan apa yang Anda inginkan.',
          icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
          buttonText: 'Kirim Permintaan Revisi',
          buttonVariant: 'secondary' as const,
          feedbackRequired: true,
          feedbackLabel: 'Detail Revisi *',
          feedbackPlaceholder: 'Jelaskan revisi yang Anda inginkan secara detail...',
        };
    }
  };

  const config = getDialogConfig();
  const isDisabled = isLoading || (config.feedbackRequired && !feedback.trim());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {config.icon}
            <DialogTitle>{config.title}</DialogTitle>
          </div>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="feedback">{config.feedbackLabel}</Label>
            <Textarea
              id="feedback"
              placeholder={config.feedbackPlaceholder}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              disabled={isLoading}
              className="resize-none"
            />
            {config.feedbackRequired && (
              <p className="text-xs text-muted-foreground">
                * Wajib diisi
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            {isLoading ? 'Memproses...' : config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

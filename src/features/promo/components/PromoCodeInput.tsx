import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Input } from '@/components/ui/forms/input';
import { Button } from '@/components/ui/buttons/button';
import { validatePromoCode, PromoCodeValidationResponse } from '../services/promoCodeService';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/lib/types';

interface PromoCodeInputProps {
  subtotal: number;
  onPromoApplied: (data: { code: string; discountAmount: number }) => void;
  onPromoRemoved: () => void;
  className?: string;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  subtotal,
  onPromoApplied,
  onPromoRemoved,
  className,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateMutation = useMutation({
    mutationFn: (code: string) => validatePromoCode(code, subtotal),
    onSuccess: (response: PromoCodeValidationResponse) => {
      const { promo_code, discount_amount } = response.data;
      setAppliedPromo({
        code: promo_code.code,
        discountAmount: discount_amount,
      });
      setError(null);
      onPromoApplied({
        code: promo_code.code,
        discountAmount: discount_amount,
      });
    },
    onError: (err: unknown) => {
      const errorMessage = getErrorMessage(
        err,
        'Kode promo tidak valid atau sudah tidak berlaku'
      );
      setError(errorMessage);
      setAppliedPromo(null);
    },
  });

  const handleApply = () => {
    if (!promoCode.trim()) {
      setError('Masukkan kode promo terlebih dahulu');
      return;
    }
    setError(null);
    validateMutation.mutate(promoCode.trim().toUpperCase());
  };

  const handleRemove = () => {
    setPromoCode('');
    setAppliedPromo(null);
    setError(null);
    onPromoRemoved();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setPromoCode(value);
    if (error) setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !appliedPromo) {
      handleApply();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Masukkan kode promo"
            value={promoCode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!!appliedPromo || validateMutation.isPending}
            className={cn(
              'uppercase',
              error && 'border-red-500 focus-visible:ring-red-500'
            )}
          />
        </div>
        {appliedPromo ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleRemove}
            disabled={validateMutation.isPending}
          >
            Hapus
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleApply}
            disabled={!promoCode.trim() || validateMutation.isPending}
          >
            {validateMutation.isPending ? 'Memvalidasi...' : 'Gunakan'}
          </Button>
        )}
      </div>

      {/* Success Message */}
      {appliedPromo && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>
            Kode promo <strong>{appliedPromo.code}</strong> berhasil diterapkan!
            Hemat Rp {appliedPromo.discountAmount.toLocaleString('id-ID')}
          </span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

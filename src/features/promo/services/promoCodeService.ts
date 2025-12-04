import api from '@/lib/api';

export interface PromoCode {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  times_used: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface PromoCodeValidationResponse {
  message: string;
  data: {
    promo_code: PromoCode;
    discount_amount: number;
    subtotal_after_discount: number;
  };
}

export interface ActivePromoCodesResponse {
  message: string;
  data: PromoCode[];
}

/**
 * Validate a promo code for the current cart
 * @param code The promo code to validate
 * @param subtotal The cart subtotal amount
 * @returns Validation response with discount details
 */
export const validatePromoCode = async (
  code: string,
  subtotal: number
): Promise<PromoCodeValidationResponse> => {
  const response = await api.post('/promo-codes/validate', {
    code,
    subtotal,
  });
  return response.data;
};

/**
 * Get all active promo codes (public endpoint)
 * @returns List of active promo codes
 */
export const getActivePromoCodes = async (): Promise<ActivePromoCodesResponse> => {
  const response = await api.get('/promo-codes/active');
  return response.data;
};

/**
 * Format discount amount for display
 * @param discountType The type of discount (percentage or fixed)
 * @param discountValue The discount value
 * @returns Formatted discount string
 */
export const formatDiscountDisplay = (
  discountType: 'percentage' | 'fixed',
  discountValue: number
): string => {
  if (discountType === 'percentage') {
    return `${discountValue}%`;
  }
  return `Rp ${discountValue.toLocaleString('id-ID')}`;
};

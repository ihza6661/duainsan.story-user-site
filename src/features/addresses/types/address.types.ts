export interface Address {
  id: number;
  user_id: number;
  label: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  street: string;
  city: string;
  state: string;
  subdistrict?: string | null;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressPayload {
  label?: string | null;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  street: string;
  city: string;
  state: string;
  subdistrict?: string | null;
  postal_code: string;
  country?: string;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

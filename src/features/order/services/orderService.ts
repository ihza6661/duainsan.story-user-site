import api from '@/lib/api';
import { ProductVariant } from '@/features/product/services/productService';

export interface OrderItem {
  id: number;
  product_id: number;
  product_variant_id: number;
  quantity: number;
  unit_price: number;
  sub_total: number;
  product: {
    id: number;
    name: string;
    product_type: 'physical' | 'digital';
    featured_image?: {
      image_url: string;
      image: string;
    };
  };
  variant: ProductVariant;
  can_review?: boolean;
  review?: {
    id: number;
    rating: number;
    comment: string | null;
    is_approved: boolean;
    created_at: string;
  } | null;
}

export interface CustomData {
  bride_full_name: string;
  groom_full_name: string;
  bride_nickname: string;
  groom_nickname: string;
  bride_parents: string;
  groom_parents: string;
  akad_date: string;
  akad_time: string;
  akad_location: string;
  reception_date: string;
  reception_time: string;
  reception_location: string;
  gmaps_link?: string;
  prewedding_photo?: string;
}

export interface CancellationRequest {
  id: number;
  order_id: number;
  cancellation_reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_at?: string;
  admin_notes?: string;
  refund_initiated: boolean;
  refund_amount?: number;
  refund_status?: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  shipping_address: string;
  order_status: 'Pending Payment' | 'Partially Paid' | 'Paid' | 'Processing' | 'Design Approval' | 'In Production' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' | 'Failed' | 'Refunded';
  payment_status: 'pending' | 'partially_paid' | 'paid' | 'expired' | 'failed';
  payment_option?: 'dp' | 'full' | 'final' | null;
  amount_paid: number;
  remaining_balance: number;
  created_at: string;
  items: OrderItem[];
  custom_data?: CustomData;
  active_cancellation_request?: CancellationRequest;
}

interface OrderResponse {
  data: Order;
}

interface OrdersResponse {
  data: Order[]; // Assuming the API returns an array of orders under 'data'
}

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await api.get<OrderResponse>(`/orders/${orderId}`);
  return response.data.data;
};

// ADD THIS NEW FUNCTION
export const fetchOrders = async (): Promise<Order[]> => {
  const response = await api.get<OrdersResponse>('/orders');
  return response.data.data;
};

export const getFinalPaymentSnapToken = async (
  orderId: string
): Promise<{ snap_token: string; message?: string }> => {
  const response = await api.post(`/orders/${orderId}/pay-final`);
  return response.data;
};

export const retryPayment = async (orderId: string): Promise<{ snap_token: string; message: string }> => {
  const response = await api.post(`/orders/${orderId}/retry-payment`);
  return response.data;
};

export interface CancelOrderRequest {
  reason: string;
}

export interface CancelOrderResponse {
  message: string;
  data: {
    id: number;
    order_id: number;
    status: string;
    cancellation_reason: string;
    created_at: string;
  };
}

export const cancelOrder = async (
  orderId: string,
  data: CancelOrderRequest
): Promise<CancelOrderResponse> => {
  const response = await api.post(`/orders/${orderId}/cancel`, data);
  return response.data;
};

/**
 * Download invoice PDF for an order
 */
export const downloadInvoice = async (orderId: string | number): Promise<void> => {
  try {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    
    // Create a blob from the PDF data
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Invoice-${orderId}.pdf`);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw error;
  }
};

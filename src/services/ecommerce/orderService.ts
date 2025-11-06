import api from '@/lib/api';
import { ProductVariant } from './productService';

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
    featured_image?: { // Assuming featured_image might be a relationship or direct object
      image_url: string;
    };
  };
  variant: ProductVariant;
  // Add other fields as needed from your backend OrderItem structure
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

export interface Order {
  id: number;
  order_number: string;
  total_amount: number;
  shipping_address: string;
  order_status: string;
  created_at: string;
  items: OrderItem[];
  // Add other fields as needed from your backend Order structure
  custom_data?: CustomData; // Add custom_data as it's used in OrderStatusPage
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
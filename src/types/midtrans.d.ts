
interface MidtransNotification {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  pdf_url: string;
  finish_redirect_url: string;
}

interface Snap {
  pay: (snapToken: string, options?: {
    onSuccess?: (result: MidtransNotification) => void;
    onPending?: (result: MidtransNotification) => void;
    onError?: (result: MidtransNotification) => void;
    onClose?: () => void;
  }) => void;
}

interface Window {
  snap?: Snap;
}

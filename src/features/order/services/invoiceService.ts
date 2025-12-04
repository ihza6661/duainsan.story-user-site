import api from '@/lib/api';

/**
 * Download order invoice as PDF
 * @param orderId Order ID
 * @returns Promise that resolves when download completes
 */
export const downloadInvoice = async (orderId: number): Promise<void> => {
  try {
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
    });

    // Create blob from response
    const blob = new Blob([response.data], { type: 'application/pdf' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Extract filename from response headers or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'Invoice.pdf';
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download invoice:', error);
    throw error;
  }
};

/**
 * Check if invoice download is available for order
 * @param paymentStatus Order payment status
 * @returns boolean
 */
export const isInvoiceAvailable = (paymentStatus: string): boolean => {
  const allowedStatuses = ['paid', 'partially_paid'];
  return allowedStatuses.includes(paymentStatus.toLowerCase());
};

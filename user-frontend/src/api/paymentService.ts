import axios from './axios';

export const paymentService = {
  // Create Razorpay order
  createRazorpayOrder: async (amount: number, orderId: string) => {
    const response = await axios.post('/payments/create-order', {
      amount,
      orderId,
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) => {
    const response = await axios.post('/payments/verify', paymentData);
    return response.data;
  },

  // Get payment details
  getPaymentDetails: async (paymentId: string) => {
    const response = await axios.get(`/payments/${paymentId}`);
    return response.data;
  },
};

const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayService {
  constructor() {
    // Check if we're in mock mode (dummy keys)
    this.isMockMode = process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_key';
    
    if (!this.isMockMode) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
  }

  // Create Razorpay order
  async createOrder(amount, currency = 'INR', receipt) {
    try {
      // Mock mode - return fake order for testing
      if (this.isMockMode) {
        console.log('🧪 MOCK MODE: Creating fake Razorpay order');
        const mockOrder = {
          id: `order_mock_${Date.now()}`,
          entity: 'order',
          amount: Math.round(amount * 100),
          amount_paid: 0,
          amount_due: Math.round(amount * 100),
          currency,
          receipt,
          status: 'created',
          attempts: 0,
          created_at: Math.floor(Date.now() / 1000),
        };
        return mockOrder;
      }

      // Real Razorpay API call
      const options = {
        amount: Math.round(amount * 100), // Amount in paise (multiply by 100)
        currency,
        receipt,
        payment_capture: 1, // Auto capture payment
      };

      const order = await this.razorpay.orders.create(options);
      return order;
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      throw new Error('Failed to create Razorpay order');
    }
  }

  // Verify payment signature
  verifyPaymentSignature(orderId, paymentId, signature) {
    try {
      // Mock mode - always return true for testing
      if (this.isMockMode) {
        console.log('🧪 MOCK MODE: Payment signature verification bypassed');
        return true;
      }

      // Real signature verification
      const text = `${orderId}|${paymentId}`;
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      return generated_signature === signature;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  // Fetch payment details
  async getPaymentDetails(paymentId) {
    try {
      // Mock mode - return fake payment details
      if (this.isMockMode) {
        console.log('🧪 MOCK MODE: Returning fake payment details');
        return {
          id: paymentId,
          entity: 'payment',
          amount: 100000,
          currency: 'INR',
          status: 'captured',
          method: 'card',
          captured: true,
          email: 'test@example.com',
          contact: '+919999999999',
          created_at: Math.floor(Date.now() / 1000),
        };
      }

      // Real API call
      const payment = await this.razorpay.payments.fetch(paymentId);
      return payment;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw new Error('Failed to fetch payment details');
    }
  }

  // Refund payment
  async refundPayment(paymentId, amount) {
    try {
      // Mock mode - return fake refund
      if (this.isMockMode) {
        console.log('🧪 MOCK MODE: Creating fake refund');
        return {
          id: `rfnd_mock_${Date.now()}`,
          entity: 'refund',
          amount: Math.round(amount * 100),
          currency: 'INR',
          payment_id: paymentId,
          status: 'processed',
          created_at: Math.floor(Date.now() / 1000),
        };
      }

      // Real API call
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: Math.round(amount * 100), // Amount in paise
      });
      return refund;
    } catch (error) {
      console.error('Refund error:', error);
      throw new Error('Failed to process refund');
    }
  }
}

module.exports = new RazorpayService();

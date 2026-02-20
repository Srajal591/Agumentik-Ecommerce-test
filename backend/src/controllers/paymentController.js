const razorpayService = require('../services/razorpayService');
const orderService = require('../services/orderService');

// Create Razorpay order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and orderId are required',
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpayService.createOrder(
      amount,
      'INR',
      `order_${orderId}`
    );

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key', // Always return key
      },
    });
  } catch (error) {
    next(error);
  }
};

// Verify Razorpay payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment verification parameters',
      });
    }

    // Verify signature
    const isValid = razorpayService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      // Update order payment status to failed
      await orderService.updatePaymentStatus(orderId, 'failed');

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Update order payment status to completed
    // Store the payment ID (even if it's a mock ID for testing)
    await orderService.updatePaymentStatus(orderId, 'completed', razorpay_payment_id);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        paymentId: razorpay_payment_id,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get payment details
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpayService.getPaymentDetails(paymentId);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Refund payment
exports.refundPayment = async (req, res, next) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Payment ID and amount are required',
      });
    }

    const refund = await razorpayService.refundPayment(paymentId, amount);

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: refund,
    });
  } catch (error) {
    next(error);
  }
};

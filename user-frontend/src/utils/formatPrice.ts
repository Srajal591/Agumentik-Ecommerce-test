/**
 * Format price to 2 decimal places
 * @param price - Price value (can be number or string)
 * @returns Formatted price string with ₹ symbol
 */
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return '₹0.00';
  }
  
  return `₹${numPrice.toFixed(2)}`;
};

/**
 * Format price without currency symbol
 * @param price - Price value (can be number or string)
 * @returns Formatted price string without symbol
 */
export const formatPriceValue = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return '0.00';
  }
  
  return numPrice.toFixed(2);
};

/**
 * Convert paise to rupees (Razorpay format)
 * @param paise - Amount in paise
 * @returns Amount in rupees
 */
export const paiseToRupees = (paise: number): number => {
  return paise / 100;
};

/**
 * Convert rupees to paise (Razorpay format)
 * @param rupees - Amount in rupees
 * @returns Amount in paise
 */
export const rupeesToPaise = (rupees: number): number => {
  return Math.round(rupees * 100);
};

import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = '@cart';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  brand?: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  addedAt: string;
}

// Get all cart items
export const getCart = async (): Promise<CartItem[]> => {
  try {
    const cartJson = await AsyncStorage.getItem(CART_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

// Add item to cart
export const addToCart = async (
  product: any,
  size?: string,
  color?: string,
  quantity: number = 1
): Promise<boolean> => {
  try {
    const cart = await getCart();
    
    // Check if same product with same size/color exists
    const existingIndex = cart.findIndex(
      item =>
        item._id === product._id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingIndex > -1) {
      // Update quantity
      cart[existingIndex].quantity += quantity;
    } else {
      // Add new item
      const cartItem: CartItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images || [],
        brand: product.brand,
        selectedSize: size,
        selectedColor: color,
        quantity,
        addedAt: new Date().toISOString(),
      };
      cart.push(cartItem);
    }

    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
};

// Remove item from cart
export const removeFromCart = async (productId: string, size?: string, color?: string): Promise<boolean> => {
  try {
    const cart = await getCart();
    const filtered = cart.filter(
      item =>
        !(item._id === productId && item.selectedSize === size && item.selectedColor === color)
    );
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
};

// Update cart item quantity
export const updateCartQuantity = async (
  productId: string,
  quantity: number,
  size?: string,
  color?: string
): Promise<boolean> => {
  try {
    const cart = await getCart();
    const itemIndex = cart.findIndex(
      item =>
        item._id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    return false;
  }
};

// Get cart total
export const getCartTotal = async (): Promise<{ subtotal: number; itemCount: number }> => {
  try {
    const cart = await getCart();
    const subtotal = cart.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + price * item.quantity;
    }, 0);
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
    return { subtotal, itemCount };
  } catch (error) {
    console.error('Error getting cart total:', error);
    return { subtotal: 0, itemCount: 0 };
  }
};

// Clear entire cart
export const clearCart = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

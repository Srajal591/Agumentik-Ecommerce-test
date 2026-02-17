import AsyncStorage from '@react-native-async-storage/async-storage';

const WISHLIST_KEY = '@wishlist';

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  brand?: string;
  rating?: number;
  addedAt: string;
}

// Get all wishlist items
export const getWishlist = async (): Promise<WishlistItem[]> => {
  try {
    const wishlistJson = await AsyncStorage.getItem(WISHLIST_KEY);
    return wishlistJson ? JSON.parse(wishlistJson) : [];
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

// Add item to wishlist
export const addToWishlist = async (product: any): Promise<boolean> => {
  try {
    const wishlist = await getWishlist();
    
    // Check if already in wishlist
    const exists = wishlist.some(item => item._id === product._id);
    if (exists) {
      return false; // Already in wishlist
    }

    const wishlistItem: WishlistItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      images: product.images || [],
      brand: product.brand,
      rating: product.rating,
      addedAt: new Date().toISOString(),
    };

    wishlist.push(wishlistItem);
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    return true;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return false;
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (productId: string): Promise<boolean> => {
  try {
    const wishlist = await getWishlist();
    const filtered = wishlist.filter(item => item._id !== productId);
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return false;
  }
};

// Check if item is in wishlist
export const isInWishlist = async (productId: string): Promise<boolean> => {
  try {
    const wishlist = await getWishlist();
    return wishlist.some(item => item._id === productId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};

// Toggle wishlist (add if not present, remove if present)
export const toggleWishlist = async (product: any): Promise<{ added: boolean; message: string }> => {
  try {
    const inWishlist = await isInWishlist(product._id);
    
    if (inWishlist) {
      await removeFromWishlist(product._id);
      return { added: false, message: 'Removed from wishlist' };
    } else {
      await addToWishlist(product);
      return { added: true, message: 'Added to wishlist' };
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    return { added: false, message: 'Error updating wishlist' };
  }
};

// Clear entire wishlist
export const clearWishlist = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(WISHLIST_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return false;
  }
};

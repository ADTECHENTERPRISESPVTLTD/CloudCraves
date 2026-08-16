import mongoose from 'mongoose';

export const validateOrderInput = (data: any): { isValid: boolean; message?: string } => {
  const { items, addressId, deliveryAddress, orderType, paymentMethod } = data;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return { isValid: false, message: 'Order must contain at least one item' };
  }

  for (const item of items) {
    if (!item.foodId || !mongoose.Types.ObjectId.isValid(item.foodId)) {
      return { isValid: false, message: `Invalid food ID format: ${item.foodId}` };
    }
    if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
      return { isValid: false, message: 'Item quantity must be a positive integer' };
    }
  }

  if (addressId && !mongoose.Types.ObjectId.isValid(addressId)) {
    return { isValid: false, message: 'Invalid address ID format' };
  }

  if (!addressId && (!deliveryAddress || !deliveryAddress.name || !deliveryAddress.house || !deliveryAddress.city)) {
    return { isValid: false, message: 'A valid delivery address or addressId is required' };
  }

  if (orderType && !['DELIVERY', 'PICKUP'].includes(orderType)) {
    return { isValid: false, message: 'Order type must be either DELIVERY or PICKUP' };
  }

  if (paymentMethod && !['COD', 'ONLINE', 'UPI', 'CARD'].includes(paymentMethod)) {
    return { isValid: false, message: 'Invalid payment method' };
  }

  return { isValid: true };
};

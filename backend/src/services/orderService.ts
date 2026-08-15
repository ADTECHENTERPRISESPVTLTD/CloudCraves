import mongoose from 'mongoose';
import { Order, IOrder, IOrderItem, IDeliveryAddressSnapshot } from '../models/Order';
import { Food } from '../models/Food';
import { Address } from '../models/Address';
import { Restaurant } from '../models/Restaurant';

export interface CreateOrderPayload {
  userId: string;
  items: Array<{ foodId: string; quantity: number }>;
  addressId?: string;
  deliveryAddress?: IDeliveryAddressSnapshot;
  orderType?: 'DELIVERY' | 'PICKUP';
  paymentMethod?: 'COD' | 'ONLINE' | 'UPI' | 'CARD';
  specialInstructions?: string;
  discount?: number;
}

export class OrderService {
  static async createVerifiedOrder(payload: CreateOrderPayload): Promise<IOrder> {
    const {
      userId,
      items: inputItems,
      addressId,
      deliveryAddress: inputAddress,
      orderType = 'DELIVERY',
      paymentMethod = 'COD',
      specialInstructions = '',
      discount: inputDiscount = 0
    } = payload;

    // 1. Input Validation
    if (!inputItems || !Array.isArray(inputItems) || inputItems.length === 0) {
      throw { statusCode: 400, message: 'Order must contain at least one food item', code: 'EMPTY_ORDER' };
    }

    // 2. Validate & Retrieve Customer Delivery Address
    let verifiedAddress: IDeliveryAddressSnapshot;

    if (addressId) {
      if (!mongoose.Types.ObjectId.isValid(addressId)) {
        throw { statusCode: 400, message: 'Invalid address ID format', code: 'INVALID_ADDRESS_ID' };
      }
      const dbAddress = await Address.findOne({ _id: addressId, userId });
      if (!dbAddress) {
        throw {
          statusCode: 404,
          message: 'Delivery address not found or does not belong to user',
          code: 'ADDRESS_NOT_FOUND'
        };
      }
      verifiedAddress = {
        name: dbAddress.name,
        phone: dbAddress.phone,
        house: dbAddress.house,
        street: dbAddress.street,
        area: dbAddress.area,
        village: dbAddress.village,
        city: dbAddress.city,
        state: dbAddress.state,
        pincode: dbAddress.pincode,
        landmark: dbAddress.landmark,
        addressType: dbAddress.addressType
      };
    } else if (inputAddress && inputAddress.name && inputAddress.phone && inputAddress.house && inputAddress.city) {
      verifiedAddress = inputAddress;
    } else {
      throw {
        statusCode: 400,
        message: 'Valid delivery address or addressId is required',
        code: 'MISSING_ADDRESS'
      };
    }

    // 3. Fetch Restaurant Settings
    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      // Fallback default restaurant if not seeded yet
      restaurant = await Restaurant.create({
        name: 'CloudCraves Kitchen',
        phone: '9876543210',
        address: 'Main Street, Village Square',
        city: 'Local Town',
        state: 'State',
        pincode: '400001',
        deliveryCharge: 30,
        minimumOrder: 100
      });
    }

    // 4. Retrieve & Verify Food Items from MongoDB (BACKEND PRICE GUARD)
    const foodIds = inputItems.map((item) => item.foodId);
    const invalidIds = foodIds.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      throw { statusCode: 400, message: 'Invalid food item ID format provided', code: 'INVALID_FOOD_ID' };
    }

    const dbFoods = await Food.find({ _id: { $in: foodIds } });
    const foodMap = new Map(dbFoods.map((food) => [food._id.toString(), food]));

    const verifiedOrderItems: IOrderItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of inputItems) {
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw {
          statusCode: 400,
          message: `Invalid quantity for food ID ${item.foodId}. Quantity must be a positive integer.`,
          code: 'INVALID_QUANTITY'
        };
      }

      const dbFood = foodMap.get(item.foodId);
      if (!dbFood) {
        throw {
          statusCode: 404,
          message: `Food item with ID '${item.foodId}' does not exist`,
          code: 'FOOD_NOT_FOUND'
        };
      }

      if (!dbFood.isAvailable) {
        throw {
          statusCode: 400,
          message: `Food item '${dbFood.name}' is currently unavailable for order`,
          code: 'FOOD_UNAVAILABLE'
        };
      }

      // STRICT BACKEND PRICE SELECTION: Use dbFood.price (DB truth) ignoring any client prices
      const verifiedPrice = dbFood.price;
      const itemSubtotal = verifiedPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      verifiedOrderItems.push({
        foodId: dbFood._id,
        name: dbFood.name,
        price: verifiedPrice,
        quantity: item.quantity
      });
    }

    // 5. Minimum Order Check
    if (restaurant.minimumOrder > 0 && calculatedSubtotal < restaurant.minimumOrder) {
      throw {
        statusCode: 400,
        message: `Subtotal ₹${calculatedSubtotal} is below restaurant minimum order amount of ₹${restaurant.minimumOrder}`,
        code: 'MINIMUM_ORDER_NOT_MET'
      };
    }

    // 6. Delivery Charge & Tax Calculations on Backend
    const calculatedDeliveryCharge = orderType === 'PICKUP' ? 0 : restaurant.deliveryCharge || 0;
    const calculatedTax = Math.round(calculatedSubtotal * 0.05 * 100) / 100; // 5% GST calculation
    const verifiedDiscount = Math.max(0, Math.min(inputDiscount, calculatedSubtotal));
    const calculatedTotalAmount = calculatedSubtotal + calculatedDeliveryCharge + calculatedTax - verifiedDiscount;

    // 7. Generate Unique Order ID
    const uniqueOrderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 8. Create Order Document
    const order = await Order.create({
      orderId: uniqueOrderId,
      userId: new mongoose.Types.ObjectId(userId),
      restaurantId: restaurant._id,
      items: verifiedOrderItems,
      subtotal: calculatedSubtotal,
      deliveryCharge: calculatedDeliveryCharge,
      tax: calculatedTax,
      discount: verifiedDiscount,
      totalAmount: calculatedTotalAmount,
      deliveryAddress: verifiedAddress,
      orderType,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'COD' : 'PENDING',
      orderStatus: 'PLACED',
      specialInstructions: specialInstructions ? specialInstructions.trim() : '',
      estimatedDeliveryTime: '30-45 mins'
    });

    return order;
  }

  static async getUserOrders(userId: string): Promise<IOrder[]> {
    return await Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
  }

  static async getUserOrderById(userId: string, id: string): Promise<IOrder> {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (isObjectId) {
      query._id = id;
    } else {
      query.orderId = id;
    }

    const order = await Order.findOne(query);

    if (!order) {
      throw {
        statusCode: 404,
        message: 'Order not found or does not belong to user',
        code: 'ORDER_NOT_FOUND'
      };
    }

    return order;
  }

  static async getUserOrderStatus(userId: string, id: string) {
    const order = await this.getUserOrderById(userId, id);

    return {
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  }
}


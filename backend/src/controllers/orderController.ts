import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { OrderService } from '../services/orderService';
import { sendSuccess, sendError } from '../utils/response';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const { items, addressId, deliveryAddress, orderType, paymentMethod, specialInstructions, discount } = req.body;

    const order = await OrderService.createVerifiedOrder({
      userId: req.user._id.toString(),
      items,
      addressId,
      deliveryAddress,
      orderType,
      paymentMethod,
      specialInstructions,
      discount
    });

    sendSuccess(res, 'Order placed successfully', order, 201);
  } catch (error: any) {
    sendError(
      res,
      error.message || 'Failed to place order',
      error.statusCode || 500,
      error.code || 'SERVER_ERROR'
    );
  }
};

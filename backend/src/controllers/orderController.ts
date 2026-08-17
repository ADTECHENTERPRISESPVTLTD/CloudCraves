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

export const getCustomerOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const orders = await OrderService.getUserOrders(req.user._id.toString());
    sendSuccess(res, 'Orders fetched successfully', orders, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch customer orders', 500, 'SERVER_ERROR');
  }
};

export const getCustomerOrderById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const { id } = req.params;
    const order = await OrderService.getUserOrderById(req.user._id.toString(), id);
    sendSuccess(res, 'Order details fetched successfully', order, 200);
  } catch (error: any) {
    sendError(
      res,
      error.message || 'Failed to fetch order details',
      error.statusCode || 404,
      error.code || 'ORDER_NOT_FOUND'
    );
  }
};

export const getCustomerOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const { id } = req.params;
    const statusData = await OrderService.getUserOrderStatus(req.user._id.toString(), id);
    sendSuccess(res, 'Order status fetched successfully', statusData, 200);
  } catch (error: any) {
    sendError(
      res,
      error.message || 'Failed to fetch order status',
      error.statusCode || 404,
      error.code || 'ORDER_NOT_FOUND'
    );
  }
};

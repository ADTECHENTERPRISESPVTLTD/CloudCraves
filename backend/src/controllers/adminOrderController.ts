import { Response } from 'express';
import { AdminAuthRequest } from '../middleware/adminMiddleware';
import { OrderService } from '../services/orderService';
import { sendSuccess, sendError } from '../utils/response';

export const getAdminOrders = async (_req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await OrderService.getAllAdminOrders();
    sendSuccess(res, 'Admin orders fetched successfully', orders, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch admin orders', 500, 'SERVER_ERROR');
  }
};

export const getAdminOrderDetails = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await OrderService.getAdminOrderById(id);
    sendSuccess(res, 'Order details fetched successfully', order, 200);
  } catch (error: any) {
    sendError(
      res,
      error.message || 'Order not found',
      error.statusCode || 404,
      error.code || 'ORDER_NOT_FOUND'
    );
  }
};

export const updateAdminOrderStatus = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, orderStatus } = req.body;
    const targetStatus = status || orderStatus;

    if (!targetStatus) {
      sendError(res, 'Order status field is required', 400, 'MISSING_STATUS');
      return;
    }

    const updatedOrder = await OrderService.updateOrderStatus(id, targetStatus);
    sendSuccess(res, 'Order status updated successfully', updatedOrder, 200);
  } catch (error: any) {
    sendError(
      res,
      error.message || 'Failed to update order status',
      error.statusCode || 400,
      error.code || 'INVALID_STATUS_TRANSITION'
    );
  }
};

export const cancelAdminOrder = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const cancelledOrder = await OrderService.cancelOrderAdmin(id);
    sendSuccess(res, 'Order cancelled successfully', cancelledOrder, 200);
  } catch (error: any) {
    sendError(
      res,
      error.message || 'Failed to cancel order',
      error.statusCode || 400,
      error.code || 'CANNOT_CANCEL_ORDER'
    );
  }
};

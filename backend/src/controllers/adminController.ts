import { Response } from 'express';
import { AdminAuthRequest } from '../middleware/adminMiddleware';
import { AdminService } from '../services/adminService';
import { sendSuccess, sendError } from '../utils/response';

export const getDashboard = async (_req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const dashboardData = await AdminService.getDashboardStats();
    sendSuccess(res, 'Dashboard data fetched successfully', dashboardData, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch dashboard statistics', 500, 'SERVER_ERROR');
  }
};

export const getAnalytics = async (_req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const analyticsData = await AdminService.getAnalyticsStats();
    sendSuccess(res, 'Analytics data fetched successfully', analyticsData, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch analytics data', 500, 'SERVER_ERROR');
  }
};

export const getCustomers = async (_req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const customers = await AdminService.getCustomersList();
    sendSuccess(res, 'Customers list fetched successfully', customers, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch customers list', 500, 'SERVER_ERROR');
  }
};

export const getCustomerById = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const customerDetails = await AdminService.getCustomerDetailsById(id);
    sendSuccess(res, 'Customer details fetched successfully', customerDetails, 200);
  } catch (error: any) {
    sendError(
      res,
      error.message || 'Customer not found',
      error.statusCode || 404,
      error.code || 'CUSTOMER_NOT_FOUND'
    );
  }
};

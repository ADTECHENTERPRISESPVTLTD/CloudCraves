import { Request, Response } from 'express';
import { RestaurantService } from '../services/restaurantService';
import { sendSuccess, sendError } from '../utils/response';
import { AdminAuthRequest } from '../middleware/adminMiddleware';

export const getRestaurantInfo = async (_req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await RestaurantService.getRestaurant();
    if (!restaurant) {
      sendError(res, 'Restaurant information not configured', 404, 'RESTAURANT_NOT_FOUND');
      return;
    }
    sendSuccess(res, 'Restaurant information fetched successfully', restaurant, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch restaurant details', 500, 'SERVER_ERROR');
  }
};

export const getRestaurantSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const restaurant = await RestaurantService.getRestaurant();
    if (!restaurant) {
      sendError(res, 'Restaurant settings not configured', 404, 'RESTAURANT_NOT_FOUND');
      return;
    }

    const settings = {
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
      isOpen: restaurant.isOpen,
      deliveryAvailable: restaurant.deliveryAvailable,
      minimumOrder: restaurant.minimumOrder,
      deliveryCharge: restaurant.deliveryCharge
    };

    sendSuccess(res, 'Restaurant settings fetched successfully', settings, 200);
  } catch (error: any) {
    sendError(res, 'Failed to fetch restaurant settings', 500, 'SERVER_ERROR');
  }
};

export const updateRestaurantInfo = async (req: AdminAuthRequest, res: Response): Promise<void> => {
  try {
    const updated = await RestaurantService.updateRestaurant(req.body);
    sendSuccess(res, 'Restaurant settings updated successfully', updated, 200);
  } catch (error: any) {
    sendError(res, 'Failed to update restaurant information', 500, 'SERVER_ERROR');
  }
};

import { Restaurant, IRestaurant } from '../models/Restaurant';

export class RestaurantService {
  static async getRestaurant(): Promise<IRestaurant | null> {
    // Returns single active restaurant metadata for cloud kitchen platform
    return await Restaurant.findOne();
  }

  static async updateRestaurant(data: Partial<IRestaurant>): Promise<IRestaurant> {
    let restaurant = await Restaurant.findOne();
    if (!restaurant) {
      restaurant = new Restaurant(data);
    } else {
      Object.assign(restaurant, data);
    }
    await restaurant.save();
    return restaurant;
  }
}

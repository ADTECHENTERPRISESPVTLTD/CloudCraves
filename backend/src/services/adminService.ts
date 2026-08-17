import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { User, IUser } from '../models/User';

export class AdminService {
  static async getDashboardStats() {
    // 1. Order Status Counts
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ['PLACED', 'ACCEPTED'] } });
    const preparingOrders = await Order.countDocuments({ orderStatus: 'PREPARING' });
    const completedOrders = await Order.countDocuments({ orderStatus: 'DELIVERED' });

    // 2. Date Ranges for Revenue Calculations
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 3. Today's Revenue (Delivered / Non-cancelled orders created today)
    const todayRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday },
          orderStatus: { $ne: 'CANCELLED' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const todayRevenue = todayRevenueAgg.length > 0 ? todayRevenueAgg[0].total : 0;

    // 4. Monthly Revenue (Delivered / Non-cancelled orders created this month)
    const monthlyRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          orderStatus: { $ne: 'CANCELLED' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const monthlyRevenue = monthlyRevenueAgg.length > 0 ? monthlyRevenueAgg[0].total : 0;

    // 5. Popular Food Items Aggregation (Top 5 items by total quantity ordered)
    const popularFoodItems = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.foodId',
          name: { $first: '$items.name' },
          price: { $first: '$items.price' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          foodId: '$_id',
          name: 1,
          price: 1,
          totalQuantity: 1,
          totalRevenue: 1
        }
      }
    ]);

    // 6. Recent Orders (Latest 10 orders)
    const recentOrders = await Order.find()
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('orderId userId totalAmount orderStatus paymentStatus createdAt');

    return {
      totalOrders,
      pendingOrders,
      preparingOrders,
      completedOrders,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      popularFoodItems,
      recentOrders
    };
  }

  static async getAnalyticsStats() {
    // Reuses dashboard aggregation logic and provides clean stats payload
    const dashboardStats = await this.getDashboardStats();

    // Additional status breakdown
    const statusBreakdownAgg = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    return {
      ...dashboardStats,
      statusBreakdown: statusBreakdownAgg
    };
  }

  static async getCustomersList() {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });

    const customerData = await Promise.all(
      users.map(async (user) => {
        const userId = user._id;

        // Count non-cancelled orders
        const orderCount = await Order.countDocuments({ userId, orderStatus: { $ne: 'CANCELLED' } });

        // Calculate total spending
        const spendingAgg = await Order.aggregate([
          { $match: { userId: new mongoose.Types.ObjectId(userId.toString()), orderStatus: { $ne: 'CANCELLED' } } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalSpending = spendingAgg.length > 0 ? Math.round(spendingAgg[0].total * 100) / 100 : 0;

        // Get last order
        const lastOrder = await Order.findOne({ userId })
          .sort({ createdAt: -1 })
          .select('orderId totalAmount orderStatus createdAt');

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          orderCount,
          totalSpending,
          lastOrder: lastOrder
            ? {
                orderId: lastOrder.orderId,
                totalAmount: lastOrder.totalAmount,
                orderStatus: lastOrder.orderStatus,
                createdAt: lastOrder.createdAt
              }
            : null,
          accountStatus: 'Active',
          createdAt: user.createdAt
        };
      })
    );

    return customerData;
  }

  static async getCustomerDetailsById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { statusCode: 400, message: 'Invalid customer ID format', code: 'INVALID_ID' };
    }

    const user = await User.findById(id).select('-passwordHash').populate('addresses');
    if (!user) {
      throw { statusCode: 404, message: 'Customer not found', code: 'CUSTOMER_NOT_FOUND' };
    }

    const userId = user._id;

    // Count orders
    const orderCount = await Order.countDocuments({ userId, orderStatus: { $ne: 'CANCELLED' } });

    // Calculate total spending
    const spendingAgg = await Order.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId.toString()), orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalSpending = spendingAgg.length > 0 ? Math.round(spendingAgg[0].total * 100) / 100 : 0;

    // Get last order
    const lastOrder = await Order.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('orderId totalAmount orderStatus createdAt');

    // Customer recent order history
    const customerOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      customer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        accountStatus: 'Active',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      orderCount,
      totalSpending,
      lastOrder: lastOrder
        ? {
            orderId: lastOrder.orderId,
            totalAmount: lastOrder.totalAmount,
            orderStatus: lastOrder.orderStatus,
            createdAt: lastOrder.createdAt
          }
        : null,
      recentOrders: customerOrders
    };
  }
}

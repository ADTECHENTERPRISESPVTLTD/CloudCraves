import { Response } from 'express';
import { Address } from '../models/Address';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

// GET all addresses for logged-in user
export const getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const addresses = await Address.find({ userId: req.user._id }).sort({ createdAt: -1 });
    sendSuccess(res, 'Addresses fetched successfully', addresses);
  } catch (error: any) {
    sendError(res, 'Failed to fetch addresses', 500, 'SERVER_ERROR');
  }
};

// POST add new address for logged-in user
export const createAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const { name, phone, house, street, area, village, city, state, pincode, landmark, addressType } = req.body;

    if (!name || !phone || !house || !area || !city || !state || !pincode) {
      sendError(res, 'Name, phone, house, area, city, state, and pincode are required', 400, 'MISSING_FIELDS');
      return;
    }

    const address = await Address.create({
      userId: req.user._id,
      name,
      phone,
      house,
      street: street || '',
      area,
      village: village || '',
      city,
      state,
      pincode,
      landmark: landmark || '',
      addressType: addressType || 'Home'
    });

    // Update User addresses reference
    await User.findByIdAndUpdate(req.user._id, { $push: { addresses: address._id } });

    sendSuccess(res, 'Address added successfully', address, 201);
  } catch (error: any) {
    sendError(res, 'Failed to add address', 500, 'SERVER_ERROR');
  }
};

// PUT update address owned by logged-in user
export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendError(res, 'Invalid address ID', 400, 'INVALID_ID');
      return;
    }

    // Verify ownership
    const address = await Address.findOne({ _id: id, userId: req.user._id });
    if (!address) {
      sendError(res, 'Address not found or unauthorized', 404, 'ADDRESS_NOT_FOUND');
      return;
    }

    Object.assign(address, req.body);
    await address.save();

    sendSuccess(res, 'Address updated successfully', address);
  } catch (error: any) {
    sendError(res, 'Failed to update address', 500, 'SERVER_ERROR');
  }
};

// DELETE address owned by logged-in user
export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User authentication required', 401, 'UNAUTHORIZED');
      return;
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      sendError(res, 'Invalid address ID', 400, 'INVALID_ID');
      return;
    }

    // Verify ownership
    const address = await Address.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!address) {
      sendError(res, 'Address not found or unauthorized', 404, 'ADDRESS_NOT_FOUND');
      return;
    }

    // Remove reference from User
    await User.findByIdAndUpdate(req.user._id, { $pull: { addresses: id } });

    sendSuccess(res, 'Address deleted successfully', address);
  } catch (error: any) {
    sendError(res, 'Failed to delete address', 500, 'SERVER_ERROR');
  }
};

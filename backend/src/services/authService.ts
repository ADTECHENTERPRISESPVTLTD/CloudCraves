import bcrypt from 'bcrypt';
import { User, IUser } from '../models/User';
import { Admin, IAdmin } from '../models/Admin';
import { generateUserToken, generateAdminToken } from '../utils/generateToken';

export class AuthService {
  static async registerUser(data: { name: string; phone: string; email: string; password: string }) {
    const existingUser = await User.findOne({ email: data.email.toLowerCase() });
    if (existingUser) {
      throw { statusCode: 400, message: 'Email address is already registered', code: 'EMAIL_EXISTS' };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      name: data.name,
      phone: data.phone,
      email: data.email.toLowerCase(),
      passwordHash,
      addresses: []
    });

    const token = generateUserToken(user._id.toString());
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    return { user: userObj, token };
  }

  static async loginUser(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      throw { statusCode: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' };
    }

    const token = generateUserToken(user._id.toString());
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    return { user: userObj, token };
  }

  static async loginAdmin(email: string, password: string) {
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!admin) {
      throw { statusCode: 401, message: 'Invalid admin credentials', code: 'INVALID_CREDENTIALS' };
    }

    if (!admin.isActive) {
      throw { statusCode: 403, message: 'Admin account is deactivated', code: 'ACCOUNT_DEACTIVATED' };
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid admin credentials', code: 'INVALID_CREDENTIALS' };
    }

    const token = generateAdminToken(admin._id.toString(), admin.role);
    const adminObj = admin.toObject();
    delete (adminObj as any).passwordHash;

    return { admin: adminObj, token };
  }
}

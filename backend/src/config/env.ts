import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: process.env.PORT || '5000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudcraves',
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret_cloudcraves',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development'
};

import { config } from 'dotenv';

config();

export const envConfig = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  LOCAL_URL: process.env.LOCAL_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  PROJECT_ADDRESS: process.env.PROJECT_ADDRESS,
  RESOURCE_ADDRESS: process.env.RESOURCE_ADDRESS,
  ADMIN_PUBLIC_KEY: process.env.ADMIN_PUBLIC_KEY,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  AUTH_PASSWORD: process.env.AUTH_PASSWORD,
};

export const databaseConfig = {
  uri: process.env.MONGO_DB_URL,
};

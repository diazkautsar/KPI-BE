import mongoose from 'mongoose';
import { env } from './env';

const url = env.DATABASE_URL;

export const connectDatabase = async () => await mongoose.connect(url);

export const disconnectDatabase = async () => await mongoose.disconnect();

export const conn = mongoose.connection;

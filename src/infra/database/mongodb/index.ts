/* eslint-disable no-process-env */
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { Logger } from '../../logs/logger';

dotenv.config();

const connection = (): mongoose.Connection => {
  const conn = mongoose.createConnection(String(process.env.MONGODB_URL));

  conn.once('connected', () => {
    Logger.info('MongoDB is connected!');
  });

  conn.on('error', (err: Error) => {
    Logger.error(`MongoDBconnection error: ${err.message}`);
  });

  conn.on('disconnected', () => {
    Logger.error('MongoDB disconnected');
  });

  return conn;
};

export const { ObjectId } = mongoose.Types;
export const mongoConnection = connection();

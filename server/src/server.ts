import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/receptionai';

import { MongoMemoryServer } from 'mongodb-memory-server';
import { BusinessConfig } from './models/BusinessConfig';
import { personasData } from './seed';

let mongoServer: MongoMemoryServer;

async function startServer() {
  try {
    console.log('Skipping real MongoDB connection, using in-memory models for demo.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

startServer();

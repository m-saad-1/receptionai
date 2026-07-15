import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/receptionai';

import { BusinessConfig } from './models/BusinessConfig';
import { personasData } from './seed';

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/receptionai';
    await mongoose.connect(mongoUri);
    console.log('Connected to real MongoDB successfully.');
    
    // Seed basic data if empty
    const count = await BusinessConfig.countDocuments();
    if (count === 0) {
      console.log('Seeding initial business configs...');
      for (const [key, data] of Object.entries(personasData)) {
        await BusinessConfig.create({
          industryKey: key,
          businessName: data.businessName,
          accentColor: data.accentColor,
          hours: '9 AM - 5 PM',
          services: [],
          policies: ''
        });
      }
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

startServer();

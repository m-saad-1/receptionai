import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { BusinessConfig } from './models/BusinessConfig';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/receptionai';

export const personasData = [
  {
    industryKey: 'restaurant',
    businessName: 'Bella Vista Bistro',
    accentColor: '#dc2626', // Red
    hours: 'Tue–Sun, 11:00 AM – 10:00 PM (closed Mondays)',
    services: [
      { name: 'Margherita Flatbread', price: '$14', notes: 'vegetarian' },
      { name: 'Truffle Mushroom Risotto', price: '$22', notes: 'vegetarian, gluten-free' },
      { name: 'Grilled Salmon', price: '$26', notes: 'gluten-free' },
      { name: 'Braised Short Rib', price: '$29', notes: '' },
      { name: 'Charred Cauliflower Steak', price: '$18', notes: 'vegan' },
      { name: 'Classic Caesar Salad', price: '$12', notes: 'add chicken +$5' },
      { name: 'Wild Mushroom Soup', price: '$9', notes: 'vegan' },
      { name: 'Tiramisu', price: '$10', notes: 'contains alcohol' },
      { name: 'Chocolate Lava Cake', price: '$11', notes: 'gluten-free available' }
    ],
    policies: 'Parties up to 6 booked directly; parties of 7+ require a $50 deposit and must be confirmed by staff. Cancellations require 2 hours notice.'
  },
  {
    industryKey: 'salon',
    businessName: 'The Fade Room',
    accentColor: '#4f46e5', // Indigo
    hours: 'Mon–Sat, 9:00 AM – 7:00 PM (closed Sundays)',
    services: [
      { name: 'Classic Haircut', duration: '30 min', price: '$28' },
      { name: 'Skin Fade', duration: '45 min', price: '$35' },
      { name: 'Beard Trim', duration: '15 min', price: '$15' },
      { name: 'Haircut + Beard Combo', duration: '50 min', price: '$42' },
      { name: 'Kids Cut (12 & under)', duration: '25 min', price: '$20' },
      { name: 'Hair Color', duration: '90 min', price: '$65+' },
      { name: 'Hot Towel Shave', duration: '30 min', price: '$25' }
    ],
    policies: 'Walk-ins welcome but appointments prioritized; 15-min grace period on no-shows before slot is released.'
  },
  {
    industryKey: 'dental',
    businessName: 'BrightSmile Dental',
    accentColor: '#0891b2', // Cyan
    hours: 'Mon–Fri, 8:00 AM – 5:00 PM; emergency slots Saturday mornings by request.',
    services: [
      { name: 'Routine Cleaning & Checkup', price: '$120' },
      { name: 'Teeth Whitening', price: '$250' },
      { name: 'Cavity Filling', price: '$180+' },
      { name: 'Tooth Extraction', price: '$200+' },
      { name: 'Braces Consultation', price: 'Free' },
      { name: 'Emergency Visit', price: '$95 (exam only)' }
    ],
    policies: 'We accept most major PPO insurance plans — our front desk can verify your specific coverage.'
  },
  {
    industryKey: 'gym',
    businessName: 'IronCore Fitness',
    accentColor: '#ea580c', // Orange
    hours: 'Mon–Fri 5:00 AM – 11:00 PM, Sat–Sun 7:00 AM – 9:00 PM',
    services: [
      { name: 'Basic', price: '$29/mo', includes: 'gym floor access' },
      { name: 'Plus', price: '$49/mo', includes: '+ all group classes' },
      { name: 'Elite', price: '$89/mo', includes: '+ 2 personal training sessions/mo, sauna access' },
      { name: 'HIIT Class', schedule: 'Mon/Wed/Fri 6 AM & 6 PM' },
      { name: 'Yoga Class', schedule: 'Tue/Thu 7 AM & 7 PM' },
      { name: 'Spin Class', schedule: 'Mon/Wed/Fri 5:30 PM' },
      { name: 'Strength Fundamentals Class', schedule: 'Sat 10 AM' }
    ],
    policies: '3-day free trial, no credit card required.'
  }
];

import { MongoMemoryServer } from 'mongodb-memory-server';

async function seed() {
  let mongoServer: MongoMemoryServer | undefined;
  try {
    let uri = MONGODB_URI;
    if (MONGODB_URI.includes('localhost')) {
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('Started in-memory MongoDB at', uri);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await BusinessConfig.deleteMany({});
    console.log('Cleared existing BusinessConfigs');

    // Insert new data
    await BusinessConfig.insertMany(personasData);
    console.log('Successfully seeded BusinessConfigs');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('Disconnected from MongoDB');
  }
}

// Export for server.ts to call it if needed, or just run it
export { seed };

if (require.main === module || process.argv[1].includes('seed')) {
  seed();
}

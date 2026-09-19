import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gift from './src/models/Gift';

dotenv.config({ path: '.env.local' });
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const prizes = [
  {
    name: 'Free Spa & Massage',
    icon: '/prizes/massage.jpg',
    color: '#14b8a6', // Teal
    isGrandPrize: false,
    isActive: true,
  },
  {
    name: 'Free Luxury Dinner',
    icon: '/prizes/dinner.jpg',
    color: '#f43f5e', // Rose
    isGrandPrize: false,
    isActive: true,
  },
  {
    name: 'Free Airport Transfer',
    icon: '/prizes/transfer.jpg',
    color: '#8b5cf6', // Violet
    isGrandPrize: false,
    isActive: true,
  },
  {
    name: 'Sidi Bou Said & Carthage Tour',
    icon: '/prizes/tour.jpg',
    color: '#f59e0b', // Amber (Grand Prize)
    isGrandPrize: true,
    isActive: true,
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing prizes
    await Gift.deleteMany({});
    console.log('Cleared existing prizes');

    // Insert new prizes
    await Gift.insertMany(prizes);
    console.log('Successfully seeded 4 prizes');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();

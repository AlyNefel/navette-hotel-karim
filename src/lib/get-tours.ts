import connectToDatabase from '@/lib/mongodb';
import Tour from '@/models/Tour';
import { tours as hardcodedTours } from '@/lib/tours-data';

export async function getToursFromDB() {
  try {
    await connectToDatabase();
    
    let tours = await Tour.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    
    if (tours.length === 0) {
      await Tour.insertMany(hardcodedTours);
      tours = await Tour.find({ isActive: true }).sort({ createdAt: -1 }).lean();
    }
    
    // Convert all nested ObjectIds and Dates to string to avoid serialization issues in Next.js
    return JSON.parse(JSON.stringify(tours));
  } catch (error) {
    console.error("Error fetching or seeding tours:", error);
    return [];
  }
}

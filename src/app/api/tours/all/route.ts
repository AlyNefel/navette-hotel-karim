import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tour from '@/models/Tour';

// GET all tours (including inactive) - admin only
export async function GET() {
  try {
    await connectToDatabase();
    const tours = await Tour.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(tours);
  } catch (err) {
    console.error('GET /api/tours/all error:', err);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

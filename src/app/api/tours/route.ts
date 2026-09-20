import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tour from '@/models/Tour';
import { getToursFromDB } from '@/lib/get-tours';

// GET all tours
export async function GET() {
  try {
    const tours = await getToursFromDB();
    return NextResponse.json(tours);
  } catch (err) {
    console.error('GET /api/tours error:', err);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

// POST create new tour
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { image, imagePublicId, gallery, galleryPublicIds, ...rest } = body;

    const tour = await Tour.create({
      ...rest,
      image: image || '/hero-sidi-bou-said.jpg',
      imagePublicId: imagePublicId || null,
      gallery: gallery || [],
      galleryPublicIds: galleryPublicIds || [],
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/tours error:', err);
    if (err.code === 11000) {
      return NextResponse.json({ error: 'A tour with this slug already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}

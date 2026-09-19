import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Tour from '@/models/Tour';
import { deleteTourImage } from '@/lib/cloudinary';

// GET single tour by id or slug
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const tour = await Tour.findById(id).lean();
    if (!tour) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    return NextResponse.json(tour);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
  }
}

// PATCH update tour
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    const tour = await Tour.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!tour) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    return NextResponse.json(tour);
  } catch (err: any) {
    console.error('PATCH /api/tours/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update tour' }, { status: 500 });
  }
}

// DELETE tour (also removes Cloudinary images)
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const tour = await Tour.findById(id);
    if (!tour) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });

    // Delete Cloudinary images
    if (tour.imagePublicId) {
      await deleteTourImage(tour.imagePublicId).catch(console.error);
    }
    if (tour.galleryPublicIds?.length) {
      await Promise.all(tour.galleryPublicIds.map((pid: string) => deleteTourImage(pid).catch(console.error)));
    }

    await Tour.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/tours/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return NextResponse.json({ error: 'Booking reference is required' }, { status: 400 });
    }

    await connectToDatabase();

    // The booking reference IS the MongoDB _id
    const booking = await Booking.findById(ref).lean() as any;

    if (!booking) {
      return NextResponse.json({ error: 'No booking found with that reference. Please double-check and try again.' }, { status: 404 });
    }

    // Return safe, client-facing fields only (no internal DB info)
    return NextResponse.json({
      id: booking._id.toString(),
      reference: booking._id.toString(),
      status: booking.status,
      type: booking.type,
      name: booking.name,
      email: booking.email,
      date: booking.date,
      time: booking.time,
      direction: booking.direction,
      tour_name: booking.tour_name,
      flight_number: booking.flight_number,
      passengers: booking.passengers,
      vehicle: booking.vehicle,
      price: booking.price,
      special_requests: booking.special_requests,
      created_at: booking.createdAt,
    });
  } catch (err: any) {
    // Handle invalid ObjectId format gracefully
    if (err.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid booking reference format.' }, { status: 400 });
    }
    console.error('Booking lookup error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

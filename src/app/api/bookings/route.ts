import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, direction, date, time, flightNumber, passengers, name, email, phone, specialRequests, price } = body;

    await connectToDatabase();

    const newBooking = await Booking.create({
      type: type || 'transfer',
      status: 'pending',
      name,
      email,
      phone,
      date,
      time,
      flight_number: flightNumber,
      direction,
      passengers,
      vehicle: 'Ford Ranger XLT',
      special_requests: specialRequests,
      price: price || 35,
    });

    // Auto-send confirmation email with booking reference (fire and forget)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    fetch(`${baseUrl}/api/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        name,
        bookingRef: newBooking._id.toString(),
        bookingType: type || 'transfer',
        status: 'pending',
        date,
        time,
        direction,
        tourName: direction, // for tours, direction stores the tour name
        flightNumber,
        passengers,
        vehicle: 'Ford Ranger XLT',
        price: price || 35,
        specialRequests,
      }),
    }).catch((err) => console.error('Auto-email error:', err));

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (err: any) {
    console.error('Bookings API error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    
    // In Mongoose, we lean() to get pure JSON objects instead of Mongoose Documents for easier serialization
    const data = await Booking.find({}).sort({ createdAt: -1 }).lean();
    
    // We map _id to id so it matches the frontend's expected "id" format that was used for Supabase UUIDs
    const formattedData = data.map((b: any) => ({
      ...b,
      id: b._id.toString(),
      created_at: b.createdAt
    }));

    return NextResponse.json(formattedData);
  } catch (err: any) {
    console.error('Bookings API error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    
    await connectToDatabase();
    
    const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    console.error('PATCH error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

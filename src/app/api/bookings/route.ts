import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Booking from '@/models/Booking';
import nodemailer from 'nodemailer';

function buildEmailHtml(data: {
  name: string; bookingRef: string; bookingType: string; status: string;
  date?: string; time?: string; direction?: string; tourName?: string;
  vehicle?: string; passengers?: number; price?: number; flightNumber?: string;
  specialRequests?: string; lookupUrl: string;
}) {
  const isTransfer = data.bookingType === 'transfer';
  const directionLabel = data.direction === 'airport_to_hotel' ? '✈️ Airport → Hotel' : '🏨 Hotel → Airport';
  const statusColor = '#E0A96D';
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:sans-serif;">
<div style="max-width:600px;margin:30px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
  <div style="background:linear-gradient(135deg,#0F4C81,#1a6bb5);padding:36px 32px;text-align:center;">
    <h1 style="color:white;margin:0;font-size:26px;">Hotel Karim</h1>
    <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">${isTransfer ? 'Transfer' : 'Tour'} Booking Confirmation</p>
  </div>
  <div style="padding:32px;">
    <p style="font-size:17px;color:#1e293b;margin-bottom:24px;">Dear <strong>${data.name}</strong>,<br/>Thank you for choosing Hotel Karim! 
      ${data.status === 'confirmed' 
        ? '<br/><br/><strong style="color:#22c55e;font-size:19px;">🎉 Good news! Your booking is fully CONFIRMED.</strong><br/>We look forward to welcoming you!' 
        : 'We have received your booking request and will confirm it shortly.'}
    </p>
    <div style="background:linear-gradient(135deg,#0F4C8115,#E0A96D15);border:2px dashed #E0A96D70;border-radius:12px;padding:18px 24px;margin-bottom:28px;text-align:center;">
      <p style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your Booking Reference</p>
      <p style="font-family:monospace;font-size:20px;font-weight:900;color:#0F4C81;margin:0;letter-spacing:2px;">${data.bookingRef.slice(-7).toUpperCase()}</p>
      <p style="font-size:12px;color:#64748b;margin:8px 0 0;">Use this to track your booking status</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:28px;">
      ${isTransfer ? `<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:12px 0;color:#64748b;width:45%;">Direction</td><td style="padding:12px 0;color:#1e293b;font-weight:600;">${directionLabel}</td></tr>` : `<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:12px 0;color:#64748b;width:45%;">Tour</td><td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.tourName || data.direction || '—'}</td></tr>`}
      ${data.flightNumber ? `<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:12px 0;color:#64748b;">Flight</td><td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.flightNumber}</td></tr>` : ''}
      <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:12px 0;color:#64748b;">Date</td><td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.date || '—'}</td></tr>
      ${data.time ? `<tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:12px 0;color:#64748b;">Time</td><td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.time}</td></tr>` : ''}
      <tr style="border-bottom:1px solid #f1f5f9;"><td style="padding:12px 0;color:#64748b;">Passengers</td><td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.passengers || 1}</td></tr>
      ${data.price ? `<tr><td style="padding:12px 0;color:#64748b;">Total</td><td style="padding:12px 0;color:#E0A96D;font-weight:700;font-size:18px;">€${data.price}</td></tr>` : ''}
    </table>
    <div style="text-align:center;margin:32px 0;">
      <a href="${data.lookupUrl}" style="display:inline-block;background:linear-gradient(135deg,#0F4C81,#1a6bb5);color:white;text-decoration:none;padding:14px 32px;border-radius:999px;font-weight:700;font-size:15px;">🔍 Track My Booking</a>
    </div>
    <p style="font-size:13px;color:#64748b;text-align:center;">Questions? WhatsApp: <a href="https://wa.me/21628580539" style="color:#0F4C81;font-weight:600;">+216 28 580 539</a></p>
  </div>
  <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="font-size:12px;color:#94a3b8;margin:0;">© Hotel Karim, Tunis, Tunisia</p>
  </div>
</div></body></html>`;
}

async function sendConfirmationEmail(data: {
  to: string; name: string; bookingRef: string; bookingType: string; status?: string;
  date?: string; time?: string; direction?: string; flightNumber?: string;
  passengers?: number; price?: number; specialRequests?: string;
}) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email] SMTP credentials missing, skipping email.');
    return;
  }
  try {
    const siteUrl = process.env.NEXTAUTH_URL || 'https://navette-hotel-karim.vercel.app';
    const lookupUrl = `${siteUrl}/en/booking-status?ref=${data.bookingRef}`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true, // port 465 always uses TLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"Hotel Karim" <${process.env.SMTP_USER}>`,
      to: data.to,
      subject: `${data.status === 'confirmed' ? '✅ Booking Confirmed' : '📋 Booking Received'} – Hotel Karim [Ref: ${data.bookingRef.slice(-7).toUpperCase()}]`,
      html: buildEmailHtml({
        name: data.name,
        bookingRef: data.bookingRef,
        bookingType: data.bookingType,
        status: data.status || 'pending',
        date: data.date,
        time: data.time,
        direction: data.direction,
        tourName: data.bookingType === 'tour' ? data.direction : undefined,
        flightNumber: data.flightNumber,
        passengers: data.passengers,
        price: data.price,
        specialRequests: data.specialRequests,
        lookupUrl,
      }),
    });
    console.log(`[Email] Confirmation sent to ${data.to}`);
  } catch (err) {
    console.error('[Email] Failed to send confirmation:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, direction, date, time, flightNumber, passengers, name, email, phone, specialRequests, price, tour_name } = body;

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
      tour_name: tour_name || '',
    });

    // Send confirmation email directly (no localhost HTTP call)
    // MUST AWAIT THIS! Otherwise Vercel kills the function before the email sends.
    await sendConfirmationEmail({
      to: email,
      name,
      bookingRef: newBooking._id.toString(),
      bookingType: type || 'transfer',
      date,
      time,
      direction,
      flightNumber,
      passengers,
      price: price || 35,
      specialRequests,
    }).catch(err => console.error('[Email] Async error:', err));

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
    
    // If status is updated to confirmed, send the confirmation email
    if (status === 'confirmed') {
      await sendConfirmationEmail({
        to: updated.email,
        name: updated.name,
        bookingRef: updated._id.toString(),
        bookingType: updated.type,
        status: 'confirmed',
        date: updated.date,
        time: updated.time,
        direction: updated.direction,
        flightNumber: updated.flight_number,
        passengers: updated.passengers,
        price: updated.price,
        specialRequests: updated.special_requests,
      }).catch(err => console.error('[Email] Async error:', err));
    }
    
    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    console.error('PATCH error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

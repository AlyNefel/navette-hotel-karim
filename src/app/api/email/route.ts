import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#E0A96D',
  confirmed: '#22c55e',
  cancelled: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  pending: '⏳ Pending Review',
  confirmed: '✅ Confirmed',
  cancelled: '❌ Cancelled',
};

function buildEmailHtml(data: {
  name: string;
  bookingRef: string;
  bookingType: string;
  status: string;
  date?: string;
  time?: string;
  direction?: string;
  tourName?: string;
  vehicle?: string;
  passengers?: number;
  price?: number;
  flightNumber?: string;
  specialRequests?: string;
  lookupUrl: string;
}) {
  const statusColor = STATUS_COLORS[data.status] || '#E0A96D';
  const statusLabel = STATUS_LABELS[data.status] || data.status;
  const isTransfer = data.bookingType === 'transfer';
  const directionLabel = data.direction === 'airport_to_hotel' ? '✈️ Airport → Hotel' : '🏨 Hotel → Airport';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmation – Hotel Karim</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Georgia',serif;">
  <div style="max-width:600px;margin:30px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#0F4C81,#1a6bb5);padding:36px 32px;text-align:center;">
      <div style="width:60px;height:60px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;color:white;font-weight:bold;">K</span>
      </div>
      <h1 style="color:white;margin:0;font-size:26px;letter-spacing:1px;">Hotel Karim</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;font-family:sans-serif;letter-spacing:2px;text-transform:uppercase;">
        ${isTransfer ? 'Transfer Booking' : 'Tour Booking'} Confirmation
      </p>
    </div>

    <!-- Status Badge -->
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-bottom:1px solid #e2e8f0;">
      <span style="display:inline-block;background:${statusColor}20;color:${statusColor};border:1.5px solid ${statusColor}50;padding:8px 20px;border-radius:999px;font-family:sans-serif;font-size:14px;font-weight:700;">
        ${statusLabel}
      </span>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="font-size:17px;color:#1e293b;margin-bottom:24px;">
        Dear <strong>${data.name}</strong>,<br/>
        Thank you for choosing Hotel Karim! 
        ${data.status === 'confirmed' 
          ? '<br/><br/><strong style="color:#22c55e;font-size:19px;">🎉 Good news! Your booking is fully CONFIRMED.</strong><br/>We look forward to welcoming you!' 
          : 'We have received your booking request and will confirm it shortly.'}
      </p>

      <!-- Booking Reference -->
      <div style="background:linear-gradient(135deg,#0F4C8115,#E0A96D15);border:2px dashed #E0A96D70;border-radius:12px;padding:18px 24px;margin-bottom:28px;text-align:center;">
        <p style="font-family:sans-serif;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your Booking Reference</p>
        <p style="font-family:monospace;font-size:20px;font-weight:900;color:#0F4C81;margin:0;letter-spacing:2px;">${data.bookingRef.slice(-7).toUpperCase()}</p>
        <p style="font-family:sans-serif;font-size:12px;color:#64748b;margin:8px 0 0;">Keep this safe — you'll need it to check your booking status</p>
      </div>

      <!-- Details Table -->
      <table style="width:100%;border-collapse:collapse;font-family:sans-serif;font-size:14px;margin-bottom:28px;">
        ${isTransfer ? `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:12px 0;color:#64748b;width:45%;">Direction</td>
          <td style="padding:12px 0;color:#1e293b;font-weight:600;">${directionLabel}</td>
        </tr>
        ${data.flightNumber ? `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:12px 0;color:#64748b;">Flight Number</td>
          <td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.flightNumber}</td>
        </tr>` : ''}
        ` : `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:12px 0;color:#64748b;width:45%;">Tour</td>
          <td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.tourName || data.direction || '—'}</td>
        </tr>
        `}
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:12px 0;color:#64748b;">Date</td>
          <td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.date || '—'}</td>
        </tr>
        ${data.time ? `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:12px 0;color:#64748b;">Time</td>
          <td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.time}</td>
        </tr>` : ''}
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:12px 0;color:#64748b;">Passengers</td>
          <td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.passengers || 1}</td>
        </tr>
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:12px 0;color:#64748b;">Vehicle</td>
          <td style="padding:12px 0;color:#1e293b;font-weight:600;">${data.vehicle || 'Ford Ranger XLT'}</td>
        </tr>
        ${data.price ? `
        <tr>
          <td style="padding:12px 0;color:#64748b;">Total Price</td>
          <td style="padding:12px 0;color:#E0A96D;font-weight:700;font-size:18px;">€${data.price}</td>
        </tr>` : ''}
      </table>

      ${data.specialRequests ? `
      <div style="background:#f8fafc;border-radius:10px;padding:14px 18px;margin-bottom:28px;">
        <p style="font-family:sans-serif;font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 6px;">Special Requests</p>
        <p style="font-family:sans-serif;font-size:14px;color:#475569;margin:0;">${data.specialRequests}</p>
      </div>` : ''}

      <!-- Track Booking CTA -->
      <div style="text-align:center;margin:32px 0;">
        <a href="${data.lookupUrl}" style="display:inline-block;background:linear-gradient(135deg,#0F4C81,#1a6bb5);color:white;text-decoration:none;padding:14px 32px;border-radius:999px;font-family:sans-serif;font-weight:700;font-size:15px;letter-spacing:0.5px;box-shadow:0 4px 14px rgba(15,76,129,0.3);">
          🔍 Track My Booking
        </a>
        <p style="font-family:sans-serif;font-size:12px;color:#94a3b8;margin:12px 0 0;">Or visit: ${data.lookupUrl}</p>
      </div>

      <div style="border-top:1px solid #e2e8f0;padding-top:20px;text-align:center;">
        <p style="font-family:sans-serif;font-size:13px;color:#64748b;margin:0;">
          Questions? Contact us on WhatsApp:
          <a href="https://wa.me/21628580539" style="color:#0F4C81;font-weight:600;">+216 28 580 539</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
      <p style="font-family:sans-serif;font-size:12px;color:#94a3b8;margin:0;">
        © Hotel Karim, Tunis, Tunisia · This is an automated email, please do not reply.
      </p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, name, bookingRef, bookingType, status, date, time, direction, tourName, vehicle, passengers, price, flightNumber, specialRequests } = body;

    if (!to || !name || !bookingRef) {
      return NextResponse.json({ error: 'Missing required fields: to, name, bookingRef' }, { status: 400 });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP credentials missing. Email not sent.');
      return NextResponse.json({ success: true, warning: 'Email credentials not configured' });
    }

    const lookupUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/en/booking-status?ref=${bookingRef}`;

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Hotel Karim" <${process.env.SMTP_USER}>`,
      to,
      subject: `${status === 'confirmed' ? '✅ Booking Confirmed' : '📋 Booking Received'} – Hotel Karim [Ref: ${bookingRef.slice(-7).toUpperCase()}]`,
      html: buildEmailHtml({
        name,
        bookingRef,
        bookingType: bookingType || 'transfer',
        status: status || 'pending',
        date,
        time,
        direction,
        tourName,
        vehicle,
        passengers,
        price,
        flightNumber,
        specialRequests,
        lookupUrl,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: err.message || 'Failed to send email' }, { status: 500 });
  }
}

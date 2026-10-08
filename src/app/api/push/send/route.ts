import { NextResponse } from 'next/server';
import webpush from 'web-push';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';

const subSchema = new mongoose.Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: { p256dh: String, auth: String },
});
const PushSub = mongoose.models.PushSubscription || mongoose.model('PushSubscription', subSchema);

try {
  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      'mailto:admin@hotelkarim.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  }
} catch (e) {
  console.warn("VAPID keys not configured, push notifications won't work in this environment.");
}

export async function POST(request: Request) {
  try {
    const { title, body, url } = await request.json();
    await connectToDatabase();
    
    const subscriptions = await PushSub.find({});
    const payload = JSON.stringify({
      title: title || '🔔 Hotel Karim Admin',
      body: body || 'You have a new notification',
      url: url || '/admin/bookings',
      icon: '/icon-512.png',
      badge: '/icon-192.png',
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        )
      )
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({ success: true, sent, failed });
  } catch (err: any) {
    console.error('[Push] Error sending notification:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(request: Request) {
  try {
    const { sessionId, message } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json({ error: 'Missing sessionId or message' }, { status: 400 });
    }

    const adminReply = {
      from: 'admin',
      text: message,
      timestamp: new Date().toISOString(),
    };

    // Push the admin's reply to the client's chat channel
    await pusher.trigger(`chat-${sessionId}`, 'message', adminReply);

    // Update admin broadcast so other admin windows see this was answered
    await pusher.trigger('admin-chat', 'admin-replied', {
      sessionId,
      message: adminReply,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Admin reply error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

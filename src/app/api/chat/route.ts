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
    const { message, sessionId, userName } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Missing message or sessionId' }, { status: 400 });
    }

    // Broadcast message to Pusher so client sees it
    await pusher.trigger(`chat-${sessionId}`, 'message', {
      from: 'user',
      text: message,
      timestamp: new Date().toISOString(),
    });

    // Broadcast to the admin channel
    await pusher.trigger('admin-chat', 'new-message', {
      sessionId,
      userName,
      from: 'user',
      text: message,
      timestamp: new Date().toISOString(),
      needsHandoff: true, // Always true since there is no AI anymore, human must answer
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Chat error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    // Parse the form data sent by Twilio webhook
    const formData = await request.formData();
    const body = formData.get('Body') as string;
    const from = formData.get('From') as string;

    if (!body || !from) {
      return NextResponse.json({ error: 'Missing payload' }, { status: 400 });
    }

    // In a real app, you might want to map the Twilio number back to a specific session_id.
    // For this implementation, we will broadcast the reply to the most recently active session
    // or you could prefix your WhatsApp replies with the session ID like "123: Yes we have rooms"
    
    // We'll just fetch the most recent session ID from the database for simplicity
    const { data: recentChats, error: fetchError } = await supabase
      .from('whatsapp_chats')
      .select('session_id')
      .eq('from_sender', 'user')
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError || !recentChats || recentChats.length === 0) {
      console.error('Could not find a recent session to reply to.');
      return new NextResponse('OK'); // Always return 200 to Twilio
    }

    const sessionId = recentChats[0].session_id;

    // Save the hotel owner's reply to the database
    const { error: dbError } = await supabase
      .from('whatsapp_chats')
      .insert([
        {
          session_id: sessionId,
          message: body,
          from_sender: 'bot', // 'bot' represents the hotel owner in the UI
        },
      ]);

    if (dbError) {
      console.error('Error saving webhook reply to Supabase:', dbError);
    }

    // Return empty TwiML response to acknowledge receipt
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response></Response>', {
      headers: { 'Content-Type': 'text/xml' }
    });

  } catch (error) {
    console.error('Webhook Error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

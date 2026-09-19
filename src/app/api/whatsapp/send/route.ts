import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { session_id, message } = await request.json();

    if (!session_id || !message) {
      return NextResponse.json({ error: 'Missing session_id or message' }, { status: 400 });
    }

    // 1. Save the user's message to Supabase
    const { error: dbError } = await supabase
      .from('whatsapp_chats')
      .insert([
        {
          session_id,
          message,
          from_sender: 'user',
        },
      ]);

    if (dbError) {
      console.error('Error saving to Supabase:', dbError);
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }

    // 2. Send the message to the WhatsApp Business API (Twilio/Meta)
    // NOTE: This requires environment variables to be set up.
    // If they are missing, we still return success because the message was saved locally.
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'
    const toWhatsAppNumber = process.env.HOTEL_OWNER_WHATSAPP; // e.g., 'whatsapp:+21620125082'

    if (accountSid && authToken && fromWhatsAppNumber && toWhatsAppNumber) {
      // Basic Twilio API integration
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      
      const formData = new URLSearchParams();
      formData.append('To', toWhatsAppNumber);
      formData.append('From', fromWhatsAppNumber);
      formData.append('Body', `New Website Chat [Session: ${session_id}]:\n\n${message}`);

      try {
        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64')
          },
          body: formData
        });

        if (!response.ok) {
          console.error('Twilio Error:', await response.text());
        }
      } catch (err) {
        console.error('Twilio Request Failed:', err);
      }
    } else {
      console.warn('Twilio credentials missing. Message saved to DB but not forwarded to WhatsApp.');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp Send Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

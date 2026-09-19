import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RouletteParticipant from '@/models/RouletteParticipant';

export async function GET() {
  try {
    await connectDB();
    const participants = await RouletteParticipant.find().sort({ createdAt: -1 });
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const participant = await RouletteParticipant.create(body);
    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create participant' }, { status: 500 });
  }
}

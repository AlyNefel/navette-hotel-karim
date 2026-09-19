import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import RouletteParticipant from '@/models/RouletteParticipant';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    
    const participant = await RouletteParticipant.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    return NextResponse.json(participant);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const participant = await RouletteParticipant.findByIdAndDelete(id);
    
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete participant' }, { status: 500 });
  }
}

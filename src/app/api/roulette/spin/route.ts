import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import RouletteParticipant from '@/models/RouletteParticipant';
import Gift from '@/models/Gift';

export async function POST(request: Request) {
  try {
    const { name, phone } = await request.json();

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone number are required.' }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch active gifts from DB
    const allGifts = await Gift.find({ isActive: true });
    
    if (allGifts.length === 0) {
      return NextResponse.json({ error: 'No prizes available at the moment.' }, { status: 500 });
    }

    const standardGifts = allGifts.filter(g => !g.isGrandPrize);
    const grandGifts = allGifts.filter(g => g.isGrandPrize);

    // Fallback if admin accidentally misconfigured gifts
    const fallbackStandard = standardGifts.length > 0 ? standardGifts : allGifts;
    const fallbackGrand = grandGifts.length > 0 ? grandGifts : fallbackStandard;

    // Check if phone number or name already played to prevent abuse
    const existingParticipant = await RouletteParticipant.findOne({ 
      $or: [
        { phone },
        { name: { $regex: new RegExp(`^${name}$`, 'i') } } // Case insensitive match for name
      ]
    });
    
    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Looks like you already spun the wheel! We will contact you soon.' }, 
        { status: 400 }
      );
    }

    // Get the total number of spins so far to determine if this is the 150th
    const totalSpins = await RouletteParticipant.countDocuments();
    
    // The 150th spin wins the grand prize
    let selectedPrize;
    if (totalSpins + 1 === 150) {
      const randomIndex = Math.floor(Math.random() * fallbackGrand.length);
      selectedPrize = fallbackGrand[randomIndex];
    } else {
      // Pick a random standard prize
      const randomIndex = Math.floor(Math.random() * fallbackStandard.length);
      selectedPrize = fallbackStandard[randomIndex];
    }

    // Save the participant and their prize using the String ID of the prize
    await RouletteParticipant.create({
      name,
      phone,
      prizeWon: selectedPrize._id.toString(),
    });

    return NextResponse.json({ 
      success: true, 
      prize: { id: selectedPrize._id.toString(), name: selectedPrize.name, icon: selectedPrize.icon },
      spinNumber: totalSpins + 1 
    });
  } catch (err: any) {
    console.error('Roulette spin error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

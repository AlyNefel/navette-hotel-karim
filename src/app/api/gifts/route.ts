import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Gift from "@/models/Gift";

export async function GET() {
  try {
    await connectToDatabase();
    const gifts = await Gift.find().sort({ createdAt: -1 });
    return NextResponse.json(gifts);
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return NextResponse.json(
      { error: "Failed to fetch gifts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await connectToDatabase();
    const newGift = await Gift.create(data);
    return NextResponse.json(newGift, { status: 201 });
  } catch (error) {
    console.error("Error creating gift:", error);
    return NextResponse.json(
      { error: "Failed to create gift" },
      { status: 500 }
    );
  }
}

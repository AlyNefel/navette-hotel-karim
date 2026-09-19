import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Gift from "@/models/Gift";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    await connectToDatabase();
    
    const updatedGift = await Gift.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );
    
    if (!updatedGift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedGift);
  } catch (error) {
    console.error("Error updating gift:", error);
    return NextResponse.json(
      { error: "Failed to update gift" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const deletedGift = await Gift.findByIdAndDelete(params.id);
    
    if (!deletedGift) {
      return NextResponse.json({ error: "Gift not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gift:", error);
    return NextResponse.json(
      { error: "Failed to delete gift" },
      { status: 500 }
    );
  }
}

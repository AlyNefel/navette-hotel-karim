import connectToDatabase from "@/lib/mongodb";
import Gift from "@/models/Gift";
import GiftsDashboard from "@/components/admin/GiftsDashboard";

export default async function AdminGiftsPage() {
  await connectToDatabase();

  // Fetch gifts and map IDs to strings
  const giftsRaw = await Gift.find().sort({ createdAt: -1 }).lean();
  const gifts = giftsRaw.map(g => ({
    _id: g._id.toString(),
    name: g.name,
    icon: g.icon,
    color: g.color,
    isGrandPrize: g.isGrandPrize,
    isActive: g.isActive,
  }));

  return <GiftsDashboard initialGifts={gifts} />;
}

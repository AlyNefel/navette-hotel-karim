import connectToDatabase from "@/lib/mongodb";
import RouletteParticipant from "@/models/RouletteParticipant";
import Gift from "@/models/Gift";
import WinnersDashboard from "@/components/admin/WinnersDashboard";

export default async function AdminWinnersPage() {
  await connectToDatabase();
  
  // Fetch participants and map IDs to strings
  const participantsRaw = await RouletteParticipant.find().sort({ createdAt: -1 }).lean();
  const participants = participantsRaw.map(p => ({
    _id: p._id.toString(),
    name: p.name,
    phone: p.phone,
    prizeWon: p.prizeWon,
    createdAt: p.createdAt.toISOString()
  }));

  // Fetch gifts for mapping prizes
  const giftsRaw = await Gift.find().lean();
  const gifts = giftsRaw.map(g => ({
    _id: g._id.toString(),
    name: g.name,
    icon: g.icon,
    color: g.color,
  }));

  return <WinnersDashboard initialParticipants={participants} gifts={gifts} />;
}

import connectToDatabase from "@/lib/mongodb";
import Booking from "@/models/Booking";
import AdminCalendarClient from "@/components/admin/AdminCalendarClient";

export default async function AdminCalendarPage() {
  await connectToDatabase();

  const bookingsRaw = await Booking.find({
    status: "confirmed",
    date: { $exists: true, $ne: "" },
  })
    .sort({ date: 1 })
    .lean();

  const bookings = bookingsRaw.map((b) => ({
    _id: b._id.toString(),
    type: b.type as "transfer" | "tour",
    status: b.status as string,
    name: b.name,
    email: b.email,
    phone: b.phone,
    date: b.date ?? "",
    time: b.time ?? "",
    flight_number: b.flight_number ?? "",
    direction: b.direction ?? "",
    passengers: b.passengers,
    vehicle: b.vehicle,
    price: b.price ?? 0,
    tour_name: b.tour_name ?? "",
    special_requests: b.special_requests ?? "",
  }));

  return <AdminCalendarClient bookings={bookings} />;
}

import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  type: 'transfer' | 'tour';
  status: 'pending' | 'confirmed' | 'cancelled';
  name: string;
  email: string;
  phone: string;
  date?: string;
  time?: string;
  flight_number?: string;
  direction?: string;
  passengers: number;
  vehicle: string;
  special_requests?: string;
  price?: number;
  tour_name?: string;
  user_id?: mongoose.Types.ObjectId; // Link to user account
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    type: { type: String, enum: ['transfer', 'tour'], required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: String },
    time: { type: String },
    flight_number: { type: String },
    direction: { type: String },
    passengers: { type: Number, default: 1 },
    vehicle: { type: String, default: 'Ford Ranger XLT' },
    special_requests: { type: String },
    price: { type: Number },
    tour_name: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

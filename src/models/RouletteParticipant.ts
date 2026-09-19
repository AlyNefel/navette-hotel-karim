import mongoose, { Schema, Document } from 'mongoose';

export interface IRouletteParticipant extends Document {
  name: string;
  phone: string;
  prizeWon: string;
  createdAt: Date;
}

const RouletteParticipantSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    prizeWon: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.RouletteParticipant || 
  mongoose.model<IRouletteParticipant>('RouletteParticipant', RouletteParticipantSchema);

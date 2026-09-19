import mongoose, { Schema, Document } from 'mongoose';

export interface IGift extends Document {
  name: string;
  icon: string;
  color: string;
  isGrandPrize: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GiftSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    isGrandPrize: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// In Next.js, check if the model is already compiled to avoid overwriting errors
export default mongoose.models.Gift || mongoose.model<IGift>('Gift', GiftSchema);

import mongoose, { Schema, Document, models } from 'mongoose';

export interface ITour extends Document {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  longDescription: string;
  duration: string;
  groupSize: string;
  price: number;
  priceGroup?: number;
  rating: number;
  reviewCount: number;
  image: string;          // Cloudinary URL
  imagePublicId?: string; // Cloudinary public_id for deletion
  gallery: string[];      // Cloudinary URLs
  galleryPublicIds?: string[];
  badge: string;
  badgeColor: string;
  includes: string[];
  excludes: string[];
  departureTimes: string[];
  meetingPoint: string;
  itinerary: { time: string; place: string; description: string }[];
  highlights: string[];
  languages: string[];
  cancellation: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TourStopSchema = new Schema({
  time: { type: String, required: true },
  place: { type: String, required: true },
  description: { type: String, required: true },
});

const TourSchema = new Schema<ITour>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: '' },
    duration: { type: String, required: true },
    groupSize: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    priceGroup: { type: Number },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    gallery: { type: [String], default: [] },
    galleryPublicIds: { type: [String], default: [] },
    badge: { type: String, default: '' },
    badgeColor: { type: String, default: 'bg-slate-700' },
    includes: { type: [String], default: [] },
    excludes: { type: [String], default: [] },
    departureTimes: { type: [String], default: [] },
    meetingPoint: { type: String, default: 'Hotel Karim lobby' },
    itinerary: { type: [TourStopSchema], default: [] },
    highlights: { type: [String], default: [] },
    languages: { type: [String], default: ['English', 'French', 'Arabic'] },
    cancellation: { type: String, default: 'Free cancellation up to 24 hours before departure' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Tour = models.Tour || mongoose.model<ITour>('Tour', TourSchema);
export default Tour;

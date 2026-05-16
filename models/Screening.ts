import mongoose, { Schema, Document, Model } from "mongoose";

export interface IScreening extends Document {
  movieId: number;
  movieTitle: string;
  startTime: Date;
  room: string;
  seats: number;
  price: number;
}

const ScreeningSchema = new Schema<IScreening>(
  {
    movieId: { type: Number, required: true, index: true },
    movieTitle: { type: String, required: true },
    startTime: { type: Date, required: true },
    room: { type: String, required: true },
    seats: { type: Number, required: true, default: 80 },
    price: { type: Number, required: true, default: 120 },
  },
  { timestamps: true }
);

const Screening: Model<IScreening> =
  mongoose.models.Screening ??
  mongoose.model<IScreening>("Screening", ScreeningSchema);

export default Screening;

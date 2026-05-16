import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IReview extends Document {
  movieId: number;
  userId: Types.ObjectId;
  author: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    movieId: { type: Number, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    author: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Review: Model<IReview> =
  mongoose.models.Review ?? mongoose.model<IReview>("Review", ReviewSchema);

export default Review;

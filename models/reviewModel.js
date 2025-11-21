import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String }, 
    review: { type: String, required: true },
    image: { type: String }, 
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);

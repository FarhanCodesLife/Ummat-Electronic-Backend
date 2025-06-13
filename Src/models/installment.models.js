import mongoose from "mongoose";

const installmentSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  monthlyAmount: Number,
  totalMonths: Number,
  startDate: Date,
  status: { type: String, enum: ["ongoing", "completed", "cancelled"], default: "ongoing" },
});

export default mongoose.model("InstallmentPlan", installmentSchema);

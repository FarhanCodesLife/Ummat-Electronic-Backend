import mongoose from "mongoose";

const baseOptions = {
  discriminatorKey: "category",
  timestamps: true,
};

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  images: [String],
  description: String,
  isInstallmentAvailable: { type: Boolean, default: false },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
}, baseOptions);

export const Product = mongoose.model("Product", productSchema);

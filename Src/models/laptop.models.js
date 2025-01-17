import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  modelname: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  screenSize: { type: String, required: true },
  processor: { type: String, required: true },
  ram: { type: String, required: true },
  storage: { type: String, required: true },
  batteryLife: { type: String, required: true },
  images: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

export default mongoose.model("Laptop", laptopSchema);

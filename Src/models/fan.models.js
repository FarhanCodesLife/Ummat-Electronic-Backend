import mongoose from "mongoose";

const fanSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  modelname: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  powerConsumption: { type: String, required: true },
  speed: { type: String, required: true },
  warranty: { type: String, required: true },
  images: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
});

export default mongoose.model("Fan", fanSchema);

// import mongoose from "mongoose";

// const mobileSchema = new mongoose.Schema({
//   brand: { type: String, required: true },
//   modelname: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   screenSize: { type: String, required: true },
//   batteryCapacity: { type: String, required: true },
//   camera: { type: String, required: true },
//   ram: { type: String, required: true },
//   storage: { type: String, required: true },
//   images: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
// });

// export default mongoose.model("Mobile", mobileSchema);


import { Product } from './products.models.js';
import mongoose from "mongoose";

const mobileSchema = new mongoose.Schema({
  modelname: { type: String, required: true },
  screenSize: { type: String, required: true },
  batteryCapacity: { type: String, required: true },
  camera: { type: String, required: true },
  ram: { type: String, required: true },
  storage: { type: String, required: true },
});

export const Mobile = Product.discriminator('mobile', mobileSchema);

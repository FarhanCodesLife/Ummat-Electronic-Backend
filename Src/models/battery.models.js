import { Product } from './products.models.js';
import mongoose from "mongoose";

const batterySchema = new mongoose.Schema({
  capacity: { type: String, required: true },
  type: { type: String, required: true },
  voltage: { type: String, required: true },
});

export const Battery = Product.discriminator('battery', batterySchema);

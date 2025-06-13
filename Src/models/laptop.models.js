import { Product } from './products.models.js';
import mongoose from "mongoose";

const laptopSchema = new mongoose.Schema({
  modelname: { type: String, required: true },
  screenSize: { type: String, required: true },
  processor: { type: String, required: true },
  ram: { type: String, required: true },
  storage: { type: String, required: true },
  batteryLife: { type: String, required: true },
});

export const Laptop = Product.discriminator('laptop', laptopSchema);

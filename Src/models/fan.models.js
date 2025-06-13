import { Product } from './products.models.js';
import mongoose from "mongoose";

const fanSchema = new mongoose.Schema({
  fanType: { type: String, required: true }, // e.g. Ceiling, Table, Wall
  power: { type: String, required: true },
  speed: { type: String, required: true },
  blades: { type: Number, required: true },
});

export const Fan = Product.discriminator('fan', fanSchema);

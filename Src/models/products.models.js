import mongoose from "mongoose";
import slugify from "slugify";



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
  slug: { type: String, required: true, unique: true },  // ✅ Slug field
}, baseOptions);

productSchema.pre("save", function(next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);

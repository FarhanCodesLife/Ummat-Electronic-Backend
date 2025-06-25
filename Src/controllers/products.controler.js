import slugify from "slugify";
import { Product } from "../models/products.models.js";
import "../models/fan.models.js";
import "../models/laptop.models.js";
import "../models/battery.models.js";
import "../models/mobile.models.js";


import { uploadMultipleToCloudinary } from "../../utils/uplaod.js";
import { extractSpecs } from "../../utils/helpers.js"; // 👈 import helper

// ✅ Add Product with Cloudinary images
export const addProduct = async (req, res) => {
  console.log("req.body:", req.body);
console.log("req.files:", req.files);
  try {
    const { category, name, ...productData } = req.body;
    
    const specs = req.body.specs || {};
    console.log("✅ Extracted Specs:", specs);

    const Model = Product.discriminators[category];
    if (!Model) {
      return res.status(400).json({ message: "Invalid category!" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Product with this name already exists!" });
    }

    
    const images = await uploadMultipleToCloudinary(req.files || []);
    if (!images.length) {
      return res.status(400).json({ message: "Image upload failed!" });
    }
    


    // // Upload all files to Cloudinary
    // const images = await uploadMultipleToCloudinary(req.files || []);
    // if (!images.length) {
    //   return res.status(400).json({ message: "Image upload failed!" });
    // }

// ✅ Final: create the product
const product = await Model.create({
  name,
  slug,
  images,
  ...productData,
  ...specs, // ✅ Dynamic category-specific specs
});


    res.status(201).json({
      message: `${category} product created successfully`,
      product,
    });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// ✅ Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("authorId")
      .populate("categoryRef");

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// ✅ Get Product By ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("authorId")
      .populate("categoryRef");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// ✅ Get Product By Slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("authorId")
      .populate("categoryRef");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const { category, name, removedImages = "[]", ...rest } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Slug Update
    if (name && name !== product.name) {
      const slug = slugify(name, { lower: true, strict: true });
      const exists = await Product.findOne({ slug });
      if (exists && exists._id.toString() !== req.params.id) {
        return res.status(400).json({ message: "Another product with this name exists!" });
      }
      rest.slug = slug;
    }

    // ✅ Parse and attach specs
    const specs = req.body.specs ? JSON.parse(req.body.specs) : {};
    
    // ✅ Parse removed images array
    const removed = JSON.parse(removedImages);
    const finalImages = (product.images || []).filter(img => !removed.includes(img));

    // ✅ Upload new images
    let newImages = [];
    if (req.files?.length) {
      newImages = await uploadMultipleToCloudinary(req.files);
    }

    const updatedImages = [...finalImages, ...newImages];

    const Model = Product.discriminators[product.category] || Product;

    const updatedProduct = await Model.findByIdAndUpdate(
      req.params.id,
      {
        name,
        ...rest,
        specs,
        images: updatedImages,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};



// ✅ Update Product by Slug
export const updateProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const { category, name, specs, removedImages, ...updateData } = req.body;

    if (name && name !== product.name) {
      const newSlug = slugify(name, { lower: true, strict: true });
      updateData.slug = newSlug;

      const existing = await Product.findOne({ slug: newSlug });
      if (existing && existing._id.toString() !== product._id.toString()) {
        return res.status(400).json({ message: "Another product with this name exists!" });
      }
    }

    // Update images
    if (req.files?.length) {
      updateData.images = req.files.map((file) => file.path);
    }

    // Remove old images if specified
    if (removedImages) {
      const removeList = JSON.parse(removedImages);
      updateData.images = (updateData.images || product.images).filter(img => !removeList.includes(img));
    }

    // Parse and merge specs
    if (specs) {
      const parsedSpecs = JSON.parse(specs);
      Object.assign(updateData, parsedSpecs);
    }

    const Model = Product.discriminators[product.category] || Product;
    const updated = await Model.findByIdAndUpdate(product._id, { name, ...updateData }, { new: true });

    res.status(200).json({ message: "Product updated successfully", product: updated });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};




// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    console.log("Deleting product with ID:", req.params.id);

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};


import { Product } from "../models/products.models.js";

export const addProduct = async (req, res) => {
  try {
    const { category, ...productData } = req.body;

    // Check category discriminator exists
    const Model = Product.discriminators[category];
    if (!Model) {
      return res.status(400).json({ message: "Invalid category!" });
    }

    // Create product based on discriminator model
    const product = await Model.create(productData);

    return res.status(201).json({
      message: `${category} product created successfully`,
      product,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("authorId").populate("categoryRef");
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("authorId").populate("categoryRef");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { category, ...updateData } = req.body;

    // Find the product first
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update using correct discriminator model
    const Model = Product.discriminators[product.category];
    if (!Model) {
      return res.status(400).json({ message: "Invalid category for update!" });
    }

    const updatedProduct = await Model.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

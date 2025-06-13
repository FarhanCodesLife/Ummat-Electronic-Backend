import { Laptop } from "../models/laptop.models.js";
import { User } from "../models/user.models.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dwuc4qz3n",
  api_key: "237728971423496",
  api_secret: "8Q6ZLV2ouehlYs67BTGq86l2R98",
});

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
});

// Function to upload image to Cloudinary
const uploadImageToCloudinary = async (localpath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto", // Automatically detect file type (image, video, etc.)
    });
    fs.unlinkSync(localpath); // Delete local file after upload
    return uploadResult.url; // Return the image URL
  } catch (error) {
    fs.unlinkSync(localpath); // Cleanup if upload fails
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

// Get all laptop posts with pagination
export const getAllLaptops = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const laptops = await Laptop.find().skip(skip).limit(limit);
    const totalLaptops = await Laptop.countDocuments();
    const totalPages = Math.ceil(totalLaptops / limit);

    res.json({
      laptops,
      totalPages,
      currentPage: page,
      totalLaptops,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a laptop post by ID
export const getLaptopById = async (req, res) => {
  const { id } = req.params;
  try {
    const laptop = await Laptop.findById(id);
    if (!laptop) {
      return res.status(404).json({ message: "Laptop post not found" });
    }
    res.status(200).json(laptop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new laptop post
export const createLaptop = async (req, res) => {
  const { brand, modelname, description, price, screenSize, processor, ram, storage, batteryLife, authorId } = req.body;

  if (!brand || !modelname || !description || !price || !screenSize || !processor || !ram || !storage || !batteryLife || !authorId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  try {
    const uploadResult = await uploadImageToCloudinary(req.file.path);
    if (!uploadResult) {
      await fs.unlink(req.file.path); // Cleanup if upload fails
      return res.status(500).json({ message: "Error occurred while uploading image" });
    }

    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const laptop = await Laptop.create({
      brand,
      modelname,
      description,
      price,
      screenSize,
      processor,
      ram,
      storage,
      batteryLife,
      images: uploadResult,
      authorId,
    });

    user.laptops.push(laptop);
    await user.save();

    res.status(201).json({ message: "Laptop post created successfully", laptop });
  } catch (error) {
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error("Error deleting local file after failure:", unlinkError);
    }
    res.status(500).json({ message: error.message });
  }
};

// Edit an existing laptop post
export const editLaptop = async (req, res) => {
  const { id } = req.params;
  const { brand, modelname, description, price, screenSize, processor, ram, storage, batteryLife } = req.body;

  try {
    const laptop = await Laptop.findById(id);
    if (!laptop) {
      return res.status(404).json({ message: "Laptop post not found" });
    }

    laptop.brand = brand || laptop.brand;
    laptop.modelname = modelname || laptop.modelname;
    laptop.description = description || laptop.description;
    laptop.price = price || laptop.price;
    laptop.screenSize = screenSize || laptop.screenSize;
    laptop.processor = processor || laptop.processor;
    laptop.ram = ram || laptop.ram;
    laptop.storage = storage || laptop.storage;
    laptop.batteryLife = batteryLife || laptop.batteryLife;

    await laptop.save();
    res.status(200).json({ message: "Laptop post updated successfully", laptop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a laptop post
export const deleteLaptop = async (req, res) => {
  const { id } = req.params;
  try {
    const laptop = await Laptop.findByIdAndDelete(id);
    if (!laptop) {
      return res.status(404).json({ message: "Laptop post not found" });
    }
    res.status(200).json({ message: "Laptop post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload image for a specific laptop post
export const laptopImage = async (req, res) => {
  const { id } = req.params;
  const laptop = await Laptop.findById(id);
  if (!laptop) {
    return res.status(404).json({ message: "Laptop post not found" });
  }

  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No image file uploaded" });
  }

  try {
    const uploadResult = await uploadImageToCloudinary(req.file.path);
    if (!uploadResult) {
      await fs.unlink(req.file.path); // Cleanup if upload fails
      return res.status(500).json({ message: "Error occurred while uploading image" });
    }

    laptop.images = uploadResult;
    await laptop.save();
    res.status(201).json({ message: "Image uploaded successfully", laptop });
  } catch (error) {
    await fs.unlink(req.file.path); // Cleanup if upload fails
    res.status(500).json({ message: error.message });
  }
};

// Export multer upload function
export { upload };

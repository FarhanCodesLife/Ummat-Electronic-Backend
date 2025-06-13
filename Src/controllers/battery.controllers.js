import { Battery } from "../models/battery.models.js";
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

// Get all battery posts with pagination
export const getAllBatteries = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const batteries = await Battery.find().skip(skip).limit(limit);
    const totalBatteries = await Battery.countDocuments();
    const totalPages = Math.ceil(totalBatteries / limit);

    res.json({
      batteries,
      totalPages,
      currentPage: page,
      totalBatteries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a battery post by ID
export const getBatteryById = async (req, res) => {
  const { id } = req.params;
  try {
    const battery = await Battery.findById(id);
    if (!battery) {
      return res.status(404).json({ message: "Battery post not found" });
    }
    res.status(200).json(battery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new battery post
export const createBattery = async (req, res) => {
  const { brand, modelname, description, price, ah, voltage, warranty, authorId } = req.body;

  if (!brand || !modelname || !description || !price || !ah || !voltage || !warranty || !authorId) {
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

    const battery = await Battery.create({
      brand,
      modelname,
      description,
      price,
      ah,
      voltage,
      warranty,
      images: uploadResult,
      authorId,
    });

    user.batteries.push(battery);
    await user.save();

    res.status(201).json({ message: "Battery post created successfully", battery });
  } catch (error) {
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error("Error deleting local file after failure:", unlinkError);
    }
    res.status(500).json({ message: error.message });
  }
};

// Edit an existing battery post
export const editBattery = async (req, res) => {
  const { id } = req.params;
  const { brand, modelname, description, price, ah, voltage, warranty } = req.body;

  try {
    const battery = await Battery.findById(id);
    if (!battery) {
      return res.status(404).json({ message: "Battery post not found" });
    }

    battery.brand = brand || battery.brand;
    battery.modelname = modelname || battery.modelname;
    battery.description = description || battery.description;
    battery.price = price || battery.price;
    battery.ah = ah || battery.ah;
    battery.voltage = voltage || battery.voltage;
    battery.warranty = warranty || battery.warranty;

    await battery.save();
    res.status(200).json({ message: "Battery post updated successfully", battery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a battery post
export const deleteBattery = async (req, res) => {
  const { id } = req.params;
  try {
    const battery = await Battery.findByIdAndDelete(id);
    if (!battery) {
      return res.status(404).json({ message: "Battery post not found" });
    }
    res.status(200).json({ message: "Battery post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload image for a specific battery post
export const batteryImage = async (req, res) => {
  const { id } = req.params;
  const battery = await Battery.findById(id);
  if (!battery) {
    return res.status(404).json({ message: "Battery post not found" });
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

    battery.images = uploadResult;
    await battery.save();
    res.status(201).json({ message: "Image uploaded successfully", battery });
  } catch (error) {
    await fs.unlink(req.file.path); // Cleanup if upload fails
    res.status(500).json({ message: error.message });
  }
};

// Export multer upload function
export { upload };

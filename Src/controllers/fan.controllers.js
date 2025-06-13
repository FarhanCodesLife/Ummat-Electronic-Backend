import { Fan } from "../models/fan.models.js";
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

// Get all fan posts with pagination
export const getAllFans = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const fans = await Fan.find().skip(skip).limit(limit);
    const totalFans = await Fan.countDocuments();
    const totalPages = Math.ceil(totalFans / limit);

    res.json({
      fans,
      totalPages,
      currentPage: page,
      totalFans,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a fan post by ID
export const getFanById = async (req, res) => {
  const { id } = req.params;
  try {
    const fan = await Fan.findById(id);
    if (!fan) {
      return res.status(404).json({ message: "Fan post not found" });
    }
    res.status(200).json(fan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new fan post
export const createFan = async (req, res) => {
  const { brand, modelname, description, price, powerConsumption, speed, warranty, authorId } = req.body;

  if (!brand || !modelname || !description || !price || !powerConsumption || !speed || !warranty || !authorId) {
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

    const fan = await Fan.create({
      brand,
      modelname,
      description,
      price,
      powerConsumption,
      speed,
      warranty,
      images: uploadResult,
      authorId,
    });

    user.fans.push(fan);
    await user.save();

    res.status(201).json({ message: "Fan post created successfully", fan });
  } catch (error) {
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error("Error deleting local file after failure:", unlinkError);
    }
    res.status(500).json({ message: error.message });
  }
};

// Edit an existing fan post
export const editFan = async (req, res) => {
  const { id } = req.params;
  const { brand, modelname, description, price, powerConsumption, speed, warranty } = req.body;

  try {
    const fan = await Fan.findById(id);
    if (!fan) {
      return res.status(404).json({ message: "Fan post not found" });
    }

    fan.brand = brand || fan.brand;
    fan.modelname = modelname || fan.modelname;
    fan.description = description || fan.description;
    fan.price = price || fan.price;
    fan.powerConsumption = powerConsumption || fan.powerConsumption;
    fan.speed = speed || fan.speed;
    fan.warranty = warranty || fan.warranty;

    await fan.save();
    res.status(200).json({ message: "Fan post updated successfully", fan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a fan post
export const deleteFan = async (req, res) => {
  const { id } = req.params;
  try {
    const fan = await Fan.findByIdAndDelete(id);
    if (!fan) {
      return res.status(404).json({ message: "Fan post not found" });
    }
    res.status(200).json({ message: "Fan post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload image for a specific fan post
export const fanImage = async (req, res) => {
  const { id } = req.params;
  const fan = await Fan.findById(id);
  if (!fan) {
    return res.status(404).json({ message: "Fan post not found" });
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

    fan.images = uploadResult;
    await fan.save();
    res.status(201).json({ message: "Image uploaded successfully", fan });
  } catch (error) {
    await fs.unlink(req.file.path); // Cleanup if upload fails
    res.status(500).json({ message: error.message });
  }
};

// Export multer upload function
export { upload };

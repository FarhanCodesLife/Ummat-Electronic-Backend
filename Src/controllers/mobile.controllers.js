import Mobile from "../models/mobile.models.js";
import userModels from "../models/user.models.js";
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

// Get all mobile posts with pagination
export const getAllMobiles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const mobiles = await Mobile.find().skip(skip).limit(limit);
    const totalMobiles = await Mobile.countDocuments();
    const totalPages = Math.ceil(totalMobiles / limit);

    res.json({
      mobiles,
      totalPages,
      currentPage: page,
      totalMobiles,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a mobile post by ID
export const getMobileById = async (req, res) => {
  const { id } = req.params;
  try {
    const mobile = await Mobile.findById(id);
    if (!mobile) {
      return res.status(404).json({ message: "Mobile post not found" });
    }
    res.status(200).json(mobile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new mobile post
export const createMobile = async (req, res) => {
  const { brand, modelname, description, price, screenSize, batteryCapacity, camera, ram, storage, authorId } = req.body;

  if (!brand || !modelname || !description || !price || !screenSize || !batteryCapacity || !camera || !ram || !storage || !authorId) {
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

    const User = await userModels.findById(authorId);
    if (!User) {
      return res.status(404).json({ message: "User not found" });
    }

    const mobile = await Mobile.create({
      brand,
      modelname,
      description,
      price,
      screenSize,
      batteryCapacity,
      camera,
      ram,
      storage,
      images: uploadResult,
      authorId,
    });

    User.mobiles.push(mobile);
    await User.save();

    res.status(201).json({ message: "Mobile post created successfully", mobile });
  } catch (error) {
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      console.error("Error deleting local file after failure:", unlinkError);
    }
    res.status(500).json({ message: error.message });
  }
};

// Edit an existing mobile post
export const editMobile = async (req, res) => {
  const { id } = req.params;
  const { brand, modelname, description, price, screenSize, batteryCapacity, camera, ram, storage } = req.body;

  try {
    const mobile = await Mobile.findById(id);
    if (!mobile) {
      return res.status(404).json({ message: "Mobile post not found" });
    }

    mobile.brand = brand || mobile.brand;
    mobile.modelname = modelname || mobile.modelname;
    mobile.description = description || mobile.description;
    mobile.price = price || mobile.price;
    mobile.screenSize = screenSize || mobile.screenSize;
    mobile.batteryCapacity = batteryCapacity || mobile.batteryCapacity;
    mobile.camera = camera || mobile.camera;
    mobile.ram = ram || mobile.ram;
    mobile.storage = storage || mobile.storage;

    await mobile.save();
    res.status(200).json({ message: "Mobile post updated successfully", mobile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a mobile post
export const deleteMobile = async (req, res) => {
  const { id } = req.params;
  try {
    const mobile = await Mobile.findByIdAndDelete(id);
    if (!mobile) {
      return res.status(404).json({ message: "Mobile post not found" });
    }
    res.status(200).json({ message: "Mobile post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload image for a specific mobile post
export const productImage = async (req, res) => {
  const { id } = req.params;
  const mobile = await Mobile.findById(id);
  if (!mobile) {
    return res.status(404).json({ message: "Mobile post not found" });
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

    mobile.images = uploadResult;
    await mobile.save();
    res.status(201).json({ message: "Image uploaded successfully", mobile });
  } catch (error) {
    await fs.unlink(req.file.path); // Cleanup if upload fails
    res.status(500).json({ message: error.message });
  }
};

// Export multer upload function
export { upload };

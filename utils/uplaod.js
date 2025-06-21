// utils/upload.js
import multer from "multer";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: "dwuc4qz3n",
  api_key: "237728971423496",
  api_secret: "8Q6ZLV2ouehlYs67BTGq86l2R98",
  timeout: 120000, // ✅ Increase timeout to 2 minutes (120000ms)
});

// ✅ Multer config for local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir); // create uploads folder if not exists
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// ✅ Multer upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// ✅ Upload single file to Cloudinary
export const uploadToCloudinary = async (localPath) => {
  try {
    const resolvedPath = path.resolve(localPath); // ✅ fix Windows path
    console.log("Uploading to Cloudinary:", resolvedPath);

    const result = await cloudinary.uploader.upload(resolvedPath, {
      folder: "products",
    });

    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);

    if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    return null;
  }
};

// ✅ Upload multiple files
export const uploadMultipleToCloudinary = async (files) => {
  const urls = [];

  for (const file of files) {
    if (file?.path) {
      const url = await uploadToCloudinary(file.path);
      if (url) urls.push(url);
    }
  }

  return urls;
};




// // ✅ Upload from buffer
// export const uploadBufferToCloudinary = (fileBuffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { folder: "products" },
//       (error, result) => {
//         if (result) resolve(result.secure_url);
//         else reject(error);
//       }
//     );
//     streamifier.createReadStream(fileBuffer).pipe(stream);
//   });
// };

// // ✅ Multiple Uploads
// export const uploadMultipleToCloudinary = async (files) => {
//   const urls = [];
//   for (const file of files) {
//     try {
//       const url = await uploadBufferToCloudinary(file.buffer, file.originalname);
//       if (url) urls.push(url);
//     } catch (err) {
//       console.error("❌ Error in one of the uploads:", err.message);
//     }
//   }
//   return urls;
// };
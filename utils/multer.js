// utils/multer.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "products",
//     allowed_formats: ["jpg", "png", "jpeg", "webp"],
//   },
// });

const storage = multer.memoryStorage(); // <--- this stores files in memory
// export const upload = multer({ storage });

const uploads = multer({ storage });

export default uploads;

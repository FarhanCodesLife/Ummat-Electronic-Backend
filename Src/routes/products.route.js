import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  getProductBySlug, // <-- Add this
  updateProduct,
  deleteProduct
} from "../controllers/products.controler.js";
import {upload} from "../../utils/uplaod.js";

import { verifyTokenMiddleware, isAdminMiddleware } from "../middlewere/auth.middlewere.js";

const router = express.Router();

router.post("/add", upload.array("images",5), addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// 🆕 Add slug-based route (put this before :id to avoid conflict)
router.get("/slug/:slug", getProductBySlug);

router.put("/:id", verifyTokenMiddleware, isAdminMiddleware, upload.array("images", 5), updateProduct);
router.delete("/:id", verifyTokenMiddleware, isAdminMiddleware, deleteProduct);

export default router;

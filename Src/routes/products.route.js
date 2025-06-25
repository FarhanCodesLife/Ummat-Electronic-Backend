import { addProduct, deleteProduct, getAllProducts, getProductById, getProductBySlug, updateProduct, updateProductBySlug } from "../controllers/products.controler.js";
import express from "express";
import {upload} from "../../utils/uplaod.js"
import { isAdminMiddleware, verifyTokenMiddleware } from "../middlewere/auth.middlewere.js";
const router = express.Router();

// 🟢 Add Product
router.post("/add", upload.array("images", 5), addProduct);

// 🟢 Get All Products
router.get("/", getAllProducts);

// 🟢 Slug-based route (must come before /:id)
router.get("/slug/:slug", getProductBySlug);

// 🟢 Get Product by ID
router.get("/:id", getProductById);

// 🟢 Update Product
router.put(
  "/:id",
  // verifyTokenMiddleware,
  // isAdminMiddleware,
  upload.array("images", 5),
  updateProduct
);
router.put("/slug/:slug", upload.array("images", 5), updateProductBySlug);

// 🟢 Delete Product
router.delete("/:id", deleteProduct);

export default router;

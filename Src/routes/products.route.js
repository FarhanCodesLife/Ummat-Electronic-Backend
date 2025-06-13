import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/products.controler.js";
import { verifyTokenMiddleware, isAdminMiddleware } from "../middlewere/auth.middlewere.js";
const router = express.Router();

router.post("/",verifyTokenMiddleware, isAdminMiddleware, addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", verifyTokenMiddleware, isAdminMiddleware, updateProduct);
router.delete("/:id", verifyTokenMiddleware, isAdminMiddleware, deleteProduct);
    
export default router;

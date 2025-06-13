import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from "../controllers/category.controllers.js";
import { verifyTokenMiddleware, isAdminMiddleware } from "../middlewere/auth.middlewere.js";    
const router = express.Router();    

router.post("/",verifyTokenMiddleware, isAdminMiddleware, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", verifyTokenMiddleware, isAdminMiddleware, updateCategory);
router.delete("/:id", verifyTokenMiddleware, isAdminMiddleware, deleteCategory);

export default router;

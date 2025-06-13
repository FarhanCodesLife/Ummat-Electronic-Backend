import express from "express";
import {
  createUser,
  logInUser,
  logoutUser,
  refreshToken,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/user.controllers.js";

import {
  verifyTokenMiddleware,
  isAdminMiddleware,
  isCustomerMiddleware,
  isTraderMiddleware
} from "../middlewere/auth.middlewere.js";

const router = express.Router();

// 🟢 Public Routes
router.post("/register", createUser);
router.post("/login", logInUser);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUser);

// 🔒 Admin Only
router.get("/", verifyTokenMiddleware, isAdminMiddleware, getAllUsers);
router.get("/:id", verifyTokenMiddleware, isAdminMiddleware, getUserById);
router.put("/:id", verifyTokenMiddleware, isAdminMiddleware, updateUser);
router.delete("/:id", verifyTokenMiddleware, isAdminMiddleware, deleteUser);

// 🔒 Optional - Trader or Customer specific routes can go here
// Example:
// router.get("/dashboard", verifyTokenMiddleware, isTraderMiddleware, (req, res) => res.send("Trader Dashboard"));

export default router;

import express from "express";
import { orderPost, allOrders } from "../controllers/order.controllers.js";
import { verifyTokenMiddleware, isCustomerMiddleware, isAdminMiddleware } from "../middlewere/auth.middlewere.js";

const router = express.Router();

// 📝 Create a new order
router.post("/", verifyTokenMiddleware, isCustomerMiddleware, orderPost);

// 📦 Get all orders
router.get("/", verifyTokenMiddleware, isAdminMiddleware, allOrders);

export default router;

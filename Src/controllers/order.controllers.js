import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";
import { Product } from "../models/products.models.js";

// Create an order
export const orderPost = async (req, res) => {
  const { userId, products, isInstallment = false } = req.body;

  try {
    if (!userId || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid input: userId and products are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const productIds = products.map((p) => p.productId);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    if (dbProducts.length !== productIds.length) {
      return res.status(404).json({ message: "Some products not found." });
    }

    let totalAmount = 0;
    for (const product of products) {
      const dbProd = dbProducts.find(p => p._id.toString() === product.productId);
      const quantity = product.quantity || 1;

      if (!dbProd.price) {
        return res.status(400).json({ message: `Product ${dbProd.name} does not have a price.` });
      }

      totalAmount += dbProd.price * quantity;
    }

    const order = await Order.create({
      userId,
      products,
      totalAmount,
      paymentStatus: "pending",
      isInstallment,
    });

    user.orders.push(order._id);
    await user.save();

    res.status(201).json({
      message: "Order created successfully",
      order,
    });

  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all orders
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("products.productId");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json({
      orders,
    });

  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

import orderModels from "../models/order.models.js";
import postModels from "../models/fan.models.js";
import userModels from "../models/user.models.js";

// Create an order
export const orderPost = async (req, res) => {
    const { autorId, products } = req.body;

    try {
        // Validate required fields
        if (!autorId || !products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid input: autorId and products are required." });
        }

        // Fetch user
        const user = await userModels.findById(autorId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Fetch all product details in one query
        const productIds = products.map((product) => product.productId);
        const posts = await postModels.find({ _id: { $in: productIds } });

        if (posts.length !== productIds.length) {
            return res.status(404).json({ message: "Some products were not found." });
        }

        // Prepare items and calculate total amount
        const items = [];
        let totalAmount = 0;

        for (const product of products) {
            const post = posts.find((p) => p._id.toString() === product.productId);
            const quantity = product.quantity || 1;

            if (!post.price) {
                return res.status(400).json({ message: `Product ${post.name} does not have a price.` });
            }

            totalAmount += post.price * quantity;

            items.push({
                product: post._id,
                name: post.name,
                price: post.price,
                quantity,
            });
        }

        




        // Create the order
        const order = await orderModels.create({
            user: user._id,
            items,
            totalAmount,
            orderStatus: "Pending", // Default status
        });

        user.orders.push(order._id)
        await user.save()

        // Send success response
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
        // Fetch all orders and populate user and products
        const orders = await orderModels.find().populate("user").populate("items.product");

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found." });
        }

        res.status(200).json({
            orders,
        });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

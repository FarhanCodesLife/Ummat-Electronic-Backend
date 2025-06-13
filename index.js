import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Src/db/index.js";
import userRouter from "./Src/routes/user.route.js";
import categoryRouter from "./Src/routes/category.route.js";
import productRouter from "./Src/routes/products.route.js";
import orderRouter from "./Src/routes/order.route.js";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "*", // Allow all origins
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

// Default Route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Swagger Setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'API for managing user authentication, registration, and more',
            contact: {
                name: "Muhammad Farhan",
                email: "farhansmit0318@gmail.com",
                phone: "03182127256",
            },
        },
        servers: [
            {
                url: 'https://backend-hackathon-nu.vercel.app/', // Auto switch between URLs
            },
        ],
    },
    apis: ['./Src/routes/*.js'], // Correct path to your routes
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// MongoDB connection and server start
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

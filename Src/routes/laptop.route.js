import express from "express";
import { createLaptop, getAllLaptops, getLaptopById, deleteLaptop, editLaptop } from "../controllers/laptop.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Laptop:
 *       type: object
 *       required:
 *         - brand
 *         - modelname
 *         - description
 *         - price
 *       properties:
 *         brand:
 *           type: string
 *           description: Brand of the laptop
 *         modelname:
 *           type: string
 *           description: Model name of the laptop
 *         description:
 *           type: string
 *           description: Description of the laptop
 *         price:
 *           type: number
 *           description: Price of the laptop
 *         screenSize:
 *           type: string
 *           description: Screen size of the laptop
 *         processor:
 *           type: string
 *           description: Processor type of the laptop
 *         ram:
 *           type: string
 *           description: RAM size of the laptop
 *         storage:
 *           type: string
 *           description: Storage capacity of the laptop
 *         batteryLife:
 *           type: string
 *           description: Battery life of the laptop
 *         images:
 *           type: string
 *           description: URL of the laptop image (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the laptop post was created
 *         authorId:
 *           type: string
 *           description: ID of the user who created the laptop post
 */

/**
 * @swagger
 * /api/laptop/create:
 *   post:
 *     summary: Create a new laptop post with an image
 *     tags: [Laptop]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               brand:
 *                 type: string
 *               modelname:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               screenSize:
 *                 type: string
 *               processor:
 *                 type: string
 *               ram:
 *                 type: string
 *               storage:
 *                 type: string
 *               batteryLife:
 *                 type: string
 *     responses:
 *       201:
 *         description: Laptop post created successfully
 *       400:
 *         description: Bad Request
 */
router.post("/create", upload.single("image"), createLaptop);

/**
 * @swagger
 * /api/laptop/all:
 *   get:
 *     summary: Get all laptop posts
 *     tags: [Laptop]
 *     responses:
 *       200:
 *         description: List of all laptop posts
 *         content:
 *           application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Laptop'
 */
router.get("/", getAllLaptops);

/**
 * @swagger
 * /api/laptop/{id}:
 *   get:
 *     summary: Get a laptop post by its ID
 *     tags: [Laptop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The laptop post ID
 *     responses:
 *       200:
 *         description: Laptop post found
 *         content:
 *           application/json:
 *           schema:
 *             $ref: '#/components/schemas/Laptop'
 *       404:
 *         description: Laptop post not found
 */
router.get("/:id", getLaptopById);

/**
 * @swagger
 * /api/laptop/{id}:
 *   delete:
 *     summary: Delete a laptop post by its ID
 *     tags: [Laptop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The laptop post ID
 *     responses:
 *       200:
 *         description: Laptop post deleted successfully
 *       404:
 *         description: Laptop post not found
 */
router.delete("/:id", deleteLaptop);

/**
 * @swagger
 * /api/laptop/{id}:
 *   put:
 *     summary: Edit a laptop post by its ID
 *     tags: [Laptop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The laptop post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               modelname:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               screenSize:
 *                 type: string
 *               processor:
 *                 type: string
 *               ram:
 *                 type: string
 *               storage:
 *                 type: string
 *               batteryLife:
 *                 type: string
 *               images:
 *                 type: string
 *     responses:
 *       200:
 *         description: Laptop post updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Laptop post not found
 */
router.put("/:id", editLaptop);

export default router;

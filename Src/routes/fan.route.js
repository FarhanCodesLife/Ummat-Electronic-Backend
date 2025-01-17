import express from "express";
import { createFan, getAllFans, getFanById, deleteFan, editFan } from "../controllers/fan.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Fan:
 *       type: object
 *       required:
 *         - brand
 *         - modelname
 *         - description
 *         - price
 *       properties:
 *         brand:
 *           type: string
 *           description: Brand of the fan
 *         modelname:
 *           type: string
 *           description: Model name of the fan
 *         description:
 *           type: string
 *           description: Description of the fan
 *         price:
 *           type: number
 *           description: Price of the fan
 *         powerConsumption:
 *           type: string
 *           description: Power consumption of the fan
 *         speed:
 *           type: string
 *           description: Speed of the fan
 *         warranty:
 *           type: string
 *           description: Warranty period of the fan
 *         images:
 *           type: string
 *           description: URL of the product image (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the fan post was created
 *         authorId:
 *           type: string
 *           description: ID of the user who created the fan post
 */

/**
 * @swagger
 * /api/fan/create:
 *   post:
 *     summary: Create a new fan post with an image
 *     tags: [Fan]
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
 *               powerConsumption:
 *                 type: string
 *               speed:
 *                 type: string
 *               warranty:
 *                 type: string
 *     responses:
 *       201:
 *         description: Fan post created successfully
 *       400:
 *         description: Bad Request
 */
router.post("/create", upload.single("image"), createFan);

/**
 * @swagger
 * /api/fan/all:
 *   get:
 *     summary: Get all fan posts
 *     tags: [Fan]
 *     responses:
 *       200:
 *         description: List of all fan posts
 *         content:
 *           application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Fan'
 */
router.get("/", getAllFans);

/**
 * @swagger
 * /api/fan/{id}:
 *   get:
 *     summary: Get a fan post by its ID
 *     tags: [Fan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The fan post ID
 *     responses:
 *       200:
 *         description: Fan post found
 *         content:
 *           application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fan'
 *       404:
 *         description: Fan post not found
 */
router.get("/:id", getFanById);

/**
 * @swagger
 * /api/fan/{id}:
 *   delete:
 *     summary: Delete a fan post by its ID
 *     tags: [Fan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The fan post ID
 *     responses:
 *       200:
 *         description: Fan post deleted successfully
 *       404:
 *         description: Fan post not found
 */
router.delete("/:id", deleteFan);

/**
 * @swagger
 * /api/fan/{id}:
 *   put:
 *     summary: Edit a fan post by its ID
 *     tags: [Fan]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The fan post ID
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
 *               powerConsumption:
 *                 type: string
 *               speed:
 *                 type: string
 *               warranty:
 *                 type: string
 *               images:
 *                 type: string
 *     responses:
 *       200:
 *         description: Fan post updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Fan post not found
 */
router.put("/:id", editFan);

export default router;

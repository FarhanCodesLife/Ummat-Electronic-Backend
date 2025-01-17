import express from "express";
import { createBattery, getAllBatteries, getBatteryById, deleteBattery, editBattery, batteryImage } from "../controllers/battery.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Battery:
 *       type: object
 *       required:
 *         - brand
 *         - modelname
 *         - description
 *         - price
 *         - ah
 *         - voltage
 *         - warranty
 *         - authorId
 *       properties:
 *         brand:
 *           type: string
 *           description: Brand of the battery
 *         modelname:
 *           type: string
 *           description: Model name of the battery
 *         description:
 *           type: string
 *           description: Description of the battery
 *         price:
 *           type: number
 *           description: Price of the battery
 *         ah:
 *           type: string
 *           description: Ampere-hour rating of the battery
 *         voltage:
 *           type: string
 *           description: Voltage rating of the battery
 *         warranty:
 *           type: string
 *           description: Warranty period of the battery
 *         images:
 *           type: string
 *           description: URL of the battery image (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the battery was created
 *         authorId:
 *           type: string
 *           description: ID of the user who created the battery post
 */

/**
 * @swagger
 * /api/battery/create:
 *   post:
 *     summary: Create a new battery post with an image
 *     tags: [Battery]
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
 *               ah:
 *                 type: string
 *               voltage:
 *                 type: string
 *               warranty:
 *                 type: string
 *               authorId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Battery post created successfully
 *       400:
 *         description: Bad Request
 */
router.post("/create", upload.single("image"), createBattery);

/**
 * @swagger
 * /api/battery/all:
 *   get:
 *     summary: Get all battery posts
 *     tags: [Battery]
 *     responses:
 *       200:
 *         description: List of all battery posts
 *         content:
 *           application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Battery'
 */
router.get("/", getAllBatteries);

/**
 * @swagger
 * /api/battery/{id}:
 *   get:
 *     summary: Get a battery post by its ID
 *     tags: [Battery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The battery ID
 *     responses:
 *       200:
 *         description: Battery post found
 *         content:
 *           application/json:
 *           schema:
 *             $ref: '#/components/schemas/Battery'
 *       404:
 *         description: Battery post not found
 */
router.get("/:id", getBatteryById);

/**
 * @swagger
 * /api/battery/{id}:
 *   delete:
 *     summary: Delete a battery post by its ID
 *     tags: [Battery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The battery ID
 *     responses:
 *       200:
 *         description: Battery post deleted successfully
 *       404:
 *         description: Battery post not found
 */
router.delete("/:id", deleteBattery);

/**
 * @swagger
 * /api/battery/{id}:
 *   put:
 *     summary: Edit a battery post by its ID
 *     tags: [Battery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The battery ID
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
 *               ah:
 *                 type: string
 *               voltage:
 *                 type: string
 *               warranty:
 *                 type: string
 *               images:
 *                 type: string
 *     responses:
 *       200:
 *         description: Battery post updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Battery post not found
 */
router.put("/:id", editBattery);

/**
 * @swagger
 * /api/battery/{id}/image:
 *   put:
 *     summary: Upload or update the image of a battery post
 *     tags: [Battery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The battery ID
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
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Bad Request
 */
router.put("/:id/image", upload.single("image"), batteryImage);

export default router;

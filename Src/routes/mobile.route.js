import express from "express";
import { createMobile, getAllMobiles, getMobileById, deleteMobile, editMobile } from "../controllers/mobile.controllers.js";
import { upload } from "../middlewere/multer.middlewere.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Mobile:
 *       type: object
 *       required:
 *         - brand
 *         - modelname
 *         - description
 *         - price
 *       properties:
 *         brand:
 *           type: string
 *           description: Brand of the mobile
 *         modelname:
 *           type: string
 *           description: Model name of the mobile
 *         description:
 *           type: string
 *           description: Description of the mobile
 *         price:
 *           type: number
 *           description: Price of the mobile
 *         screenSize:
 *           type: string
 *           description: Screen size of the mobile
 *         batteryCapacity:
 *           type: string
 *           description: Battery capacity of the mobile
 *         camera:
 *           type: string
 *           description: Camera specifications of the mobile
 *         ram:
 *           type: string
 *           description: RAM size of the mobile
 *         storage:
 *           type: string
 *           description: Storage size of the mobile
 *         images:
 *           type: string
 *           description: URL of the product image (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the mobile was created
 *         authorId:
 *           type: string
 *           description: ID of the user who created the mobile post
 */

/**
 * @swagger
 * /api/mobile/create:
 *   post:
 *     summary: Create a new mobile post with an image
 *     tags: [Mobile]
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
 *               batteryCapacity:
 *                 type: string
 *               camera:
 *                 type: string
 *               ram:
 *                 type: string
 *               storage:
 *                 type: string
 *     responses:
 *       201:
 *         description: Mobile post created successfully
 *       400:
 *         description: Bad Request
 */
router.post("/create", upload.single("image"), createMobile);

/**
 * @swagger
 * /api/mobile/all:
 *   get:
 *     summary: Get all mobile posts
 *     tags: [Mobile]
 *     responses:
 *       200:
 *         description: List of all mobile posts
 *         content:
 *           application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Mobile'
 */
router.get("/", getAllMobiles);

/**
 * @swagger
 * /api/mobile/{id}:
 *   get:
 *     summary: Get a mobile post by its ID
 *     tags: [Mobile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The mobile post ID
 *     responses:
 *       200:
 *         description: Mobile post found
 *         content:
 *           application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mobile'
 *       404:
 *         description: Mobile post not found
 */
router.get("/:id", getMobileById);

/**
 * @swagger
 * /api/mobile/{id}:
 *   delete:
 *     summary: Delete a mobile post by its ID
 *     tags: [Mobile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The mobile post ID
 *     responses:
 *       200:
 *         description: Mobile post deleted successfully
 *       404:
 *         description: Mobile post not found
 */
router.delete("/:id", deleteMobile);

/**
 * @swagger
 * /api/mobile/{id}:
 *   put:
 *     summary: Edit a mobile post by its ID
 *     tags: [Mobile]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The mobile post ID
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
 *               batteryCapacity:
 *                 type: string
 *               camera:
 *                 type: string
 *               ram:
 *                 type: string
 *               storage:
 *                 type: string
 *               images:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mobile post updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Mobile post not found
 */
router.put("/:id", editMobile);

export default router;

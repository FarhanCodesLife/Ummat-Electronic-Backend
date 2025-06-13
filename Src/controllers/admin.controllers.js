// import userModel from "../models/user.model.js";
// import adminModel from "../models/admin.model.js"; // Assuming you have a model for admin
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";

// // Helper functions for token generation
// const generateAccessToken = (user) => {
//   return jwt.sign(
//     { id: user._id, email: user.email },
//     process.env.SECRET_KEY,
//     { expiresIn: "1d" }
//   );
// };

// const generateRefreshToken = (user) => {
//   return jwt.sign(
//     { id: user._id, email: user.email },
//     process.env.SECRET_KEY,
//     { expiresIn: "7d" }
//   );
// };

// // Nodemailer configuration
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false, // Use true for 465 port, otherwise false
//   auth: {
//     user: process.env.EMAIL_USER || "your_email@example.com", // Replace with environment variable
//     pass: process.env.EMAIL_PASS || "your_email_password", // Use environment variable
//   },
// });

// // Admin email check (specify the admin email)
// const ADMIN_EMAIL = "admin@example.com"; 








// import adminModel from "../models/admin.model.js";
// import bcrypt from "bcrypt";

// const seedAdmin = async () => {
//   try {
//     const adminEmail = "admin@example.com";
//     const adminPassword = "securepassword";

//     const existingAdmin = await adminModel.findOne({ email: adminEmail });
//     if (existingAdmin) {
//       console.log("Admin already exists");
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(adminPassword, 10);
//     const admin = new adminModel({
//       email: adminEmail,
//       password: hashedPassword,
//     });

//     await admin.save();
//     console.log("Admin user created successfully");
//   } catch (error) {
//     console.error("Error creating admin:", error.message);
//   }
// };

// seedAdmin();












// // Create User (Customer)
// export const createUser = async (req, res) => {
//   const { name, email, password,  } = req.body;

//   // Validate required fields
//   if (!name || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);

//     const user = await userModel.create({
//       name,
//       email,
//       password: hashPassword,
//     });

//     const info = await transporter.sendMail({
//       from: '"Platform Team" <your_email@example.com>',
//       to: email,
//       subject: "Welcome to our platform!",
//       text: `Hi ${name}, welcome to our platform!`,
//       html: `<b>Hi ${name},</b><p>Welcome to our platform!</p>`,
//     });

//     console.log("Message sent: %s", info.messageId);

//     res.status(201).json({
//       emailSent: true,
//       emailId: info.messageId,
//       message: "User created successfully",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Log In User (Customer / Admin)
// export const logInUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     let user;
//     if (email === ADMIN_EMAIL) {
//       // Admin login
//       user = await adminModel.findOne({ email });
//     } else {
//       // Customer login
//       user = await userModel.findOne({ email });
//     }

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid password" });
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(200).json({
//       message: "Login successful",
//       user,
//       accessToken,
//       role: email === ADMIN_EMAIL ? "admin" : "user", // Returning role based on the login type
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Refresh Token function for both user and admin
// export const refreshToken = async (req, res) => {
//   try {
//     const { refreshToken } = req.cookies;

//     if (!refreshToken) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const user = jwt.verify(refreshToken, process.env.SECRET_KEY);

//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // Generate new tokens
//     const accessToken = generateAccessToken(user);
//     const newRefreshToken = generateRefreshToken(user);

//     // Update refresh token cookie
//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({ message: "Token refreshed successfully", accessToken });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Logout function for both user and admin
// export const logoutUser = async (req, res) => {
//   try {
//     // Clear the refresh token cookie
//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production", // Secure only in production
//       sameSite: "strict",
//     });
//     res.json({ message: "Logout successful" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get all users function (for admin)
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await userModel.find(); // Assuming userModel is defined for managing customers
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Example: Update user (only for admin)
// export const updateUser = async (req, res) => {
//   const { id } = req.params;
//   const { name, email } = req.body;

//   try {
//     const user = await userModel.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (name) user.name = name;
//     if (email) user.email = email;
//     if (role) user.role = role;

//     await user.save();

//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete user function (only for admin)
// export const deleteUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await userModel.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

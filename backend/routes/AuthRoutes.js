import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/AuthContoller.js";
import { authMiddleware } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

export default router;
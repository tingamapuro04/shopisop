import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
const userRouter = Router();



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { getAllUsers, getUserById, registerUser, loginUser, updateProfilePicture, promoteToAdmin, deleteUser } from "../controllers/user.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";


const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  message: "Too many login attempts, please try again later",
});

const registLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  message: "Too many signup attempts, please try again later",
});

userRouter.get("/", getAllUsers);
userRouter.post("/", registLimiter, upload.single("profilePicture"), registerUser);
userRouter.post("/login", authLimiter, loginUser);
userRouter.put("/:id", authenticateToken, upload.single("profilePicture"), updateProfilePicture);
userRouter.patch("/:id", authenticateToken, promoteToAdmin);
userRouter.delete("/:id", authenticateToken, deleteUser);
userRouter.get("/:id", getUserById);


export default userRouter;
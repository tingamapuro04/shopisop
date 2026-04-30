import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
const userRouter = Router();



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { getAllUsers, getUserById, registerUser, loginUser, updateProfilePicture, promoteToAdmin, deleteUser } from "../controllers/user.js";


const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  message: "Too many login attempts, please try again later",
});

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", authLimiter, upload.single("profilePicture"), registerUser);
userRouter.post("/login", authLimiter, loginUser);
userRouter.put("/:id", authLimiter, upload.single("profilePicture"), updateProfilePicture);
userRouter.put("/:id", promoteToAdmin);
userRouter.delete("/:id", deleteUser);


export default userRouter;
import { Router } from "express";
import multer from "multer";
const userRouter = Router();



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { getAllUsers, getUserById, registerUser, loginUser } from "../controllers/user.js";

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", upload.single("profilePicture"), registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
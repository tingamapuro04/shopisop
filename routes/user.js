import { Router } from "express";
import multer from "multer";
const userRouter = Router();



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { getAllUsers, getUserById, createUser } from "../controllers/user.js";

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", upload.single("profilePicture"), createUser);
export default userRouter;
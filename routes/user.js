import { Router } from "express";
import multer from "multer";
const userRouter = Router();



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { getAllUsers, getUserById, registerUser, loginUser, updateProfilePicture, promoteToAdmin } from "../controllers/user.js";

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", upload.single("profilePicture"), registerUser);
userRouter.post("/login", loginUser);
userRouter.put("/:id", upload.single("profilePicture"), updateProfilePicture);
userRouter.put("/:id", promoteToAdmin);
userRouter.delete("/:id", deleteUser);


export default userRouter;
import { Router } from "express";
const userRouter = Router();

import { getAllUsers, getUserById, createUser } from "../controllers/user.js";

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/", createUser);
export default userRouter;
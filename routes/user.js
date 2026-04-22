import { Router } from "express";
const userRouter = Router();

import { getAllUsers } from "../controllers/user.js";

userRouter.get("/", getAllUsers);

export default userRouter;
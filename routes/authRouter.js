import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUser, loginUser, logoutUser, currentUser, updateAvatar } from "../controllers/authControllers.js";
import { registerSchema, loginSchema } from "../schemas/userSchemas.js";
import { auth } from "../middlewares/auth.js";

import upload from "../middlewares/upload.js";

const authRouter = express.Router();



authRouter.post("/register", validateBody(registerSchema), registerUser);

authRouter.post("/login", validateBody(loginSchema), loginUser);

authRouter.post("/logout", auth, logoutUser);
 
authRouter.get("/current", auth, currentUser);

authRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar)


export default authRouter;
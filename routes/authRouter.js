import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUser, loginUser, logoutUser } from "../controllers/authControllers.js";
import { registerSchema, loginSchema } from "../schemas/userSchemas.js";
import { auth } from "../middlewares/auth.js";

const authRouter = express.Router();



authRouter.post("/register", validateBody(registerSchema), registerUser);

authRouter.post("/login", validateBody(loginSchema), loginUser);

authRouter.post("/logout", auth, logoutUser);
 
authRouter.get("/current", auth, currentUser);


export default authRouter;
import User from "../models/users.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = async (req, res, next) => {
    const { authorization = "" } = req.headers
    
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        return res.status(401).send({message: "Unauthorized"})
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id)
        if (!user || !user.token || user.token !== token) {
        return res.status(401).send({message: "Unauthorized"})
        }
        req.user = user;
        next()
    } catch(error) {
        next(error)
    }
}
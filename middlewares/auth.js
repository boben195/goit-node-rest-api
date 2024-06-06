import User from "../models/users.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;



export const auth = async (req, res, next) => {
    const { authorization = "" } = req.headers;

    

    if (!authorization) {
        return res.status(401).send({ message: "Authorization header missing" });
    }

    const [bearer, token] = authorization.split(" ");
    
    

    if (bearer !== "Bearer" || !token) {
        return res.status(401).send({ message: "Invalid authorization format" });
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);

        if (!user || !user.token || user.token !== token) {
            return res.status(401).send({ message: "Not authorized" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(401).send({ message: "Invalid or expired token" });
    }
};



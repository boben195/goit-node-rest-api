import User from "../models/users.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "node:path";
import Jimp from "jimp";
import gravatar from "gravatar";
import cripto from "node:crypto";
import fs from "fs/promises"


const JWT_SECRET = process.env.JWT_SECRET;
const avatarFolder = path.resolve("public", "avatars");


export const registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });
        
        if (user !== null) {
            return res.status(409).send({message: "Email already exist"})
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const avatarURL = gravatar.url(email);
        const newUser = await User.create({ email, password: passwordHash, avatarURL });
        
        res.status(201).json({
            email: newUser.email,
            subscription: newUser.subscription,
            
        })
    }
    catch(error) {
        next(error)
    }
}


export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user === null) {
            return res.status(401).send({message: "Email or password is wrong"})
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (passwordCompare === false) {
            return res.status(401).send({message: "Email or password is wrong"})
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" })
        await User.findByIdAndUpdate(user._id, { token });
        res.status(200).json({
            token: token,
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        });
            }
    catch (error) {
        next(error);
        }
}


export const logoutUser = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: null });
        res.status(204).json({});
    }
    catch (error) {
        next(error);
        }
}

export const currentUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const { email, subscription } = req.user;
        
        res.status(200).json({
            email,
            subscription
        })
    } catch (error) {
        next(error)
    }
}

export const updateAvatar = async (req, res, next) => {
    try {
        const { _id } = req.user;
        if (!req.file) {
            return res.status(400).json({ message: "Avatar not uploaded" });
        }

        const { path: tmpUpload, originalname } = req.file
        
        const img = await Jimp.read(tmpUpload);
        img.resize(250, 250).write(tmpUpload)

        const filename = `${cripto.randomUUID()}_${originalname}`;
        const resultUpload = path.join(avatarFolder, filename)
        
        await fs.rename(tmpUpload, resultUpload);
        const avatarURL = path.join("avatars", filename);

        await User.findByIdAndUpdate(_id, { avatarURL });
        res.status(200).json({ avatarURL });
    } catch (error) {
        next(error)
    }
}


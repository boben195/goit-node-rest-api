import User from "../models/users.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "node:path";
import Jimp from "jimp";
import gravatar from "gravatar";
import cripto from "node:crypto";
import fs from "fs/promises"

import { sendMail } from "../sandmail.js";


const JWT_SECRET = process.env.JWT_SECRET;
const avatarFolder = path.resolve("public", "avatars");


export const registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });
        
        if (user !== null) {
            return res.status(409).send({message: "Email already exist"})
        }
        const verificationToken = cripto.randomUUID();

        const passwordHash = await bcrypt.hash(password, 10)
        const avatarURL = gravatar.url(email);
        const newUser = await User.create({ email, password: passwordHash, avatarURL, verificationToken });

        const verifyMail = {
            to: email,
            from: "boben195@ukr.net",
            subject: "Welcome to hell",
            html: `Conform your mail or DIE. Please go to the  <a href="http://localhost:3000/users/verify/${verificationToken}">Link</a>`,
            text: `Conform your mail or DIE. Please go to the link http://localhost:3000/users/verify/${verificationToken}`,
        }
        await sendMail(verifyMail);
        
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
        if (user.verify === false) {
            return res.status(401).send({message: "Please verify your email"})
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


export const verifyUser = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        await User.findByIdAndUpdate(user._id, {
            verify: true,
            verificationToken: "",
        })
        res.status(200).json({message: "Verification successful"})
    } catch (error) {
        next(error)
    }
}

export const forwordVerifyMail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (user === null) {
            return res.status(401).send({ message: "Email is wrong" });
        }
        if (user.verify === true) {
            return res.status(404).send({ message: "Verification has already been passed" });
        }

        const verifyMail = {
            to: email,
            from: "boben195@ukr.net",
            subject: "Welcome to hell",
            html: `Conform your mail or DIE. Please go to the link <a href="http://localhost:3000/users/verify/${verificationToken}">Link</a>`,
            text: `Conform your mail or DIE. Please go to the link http://localhost:3000/users/verify/${verificationToken}`,
        }
        await sendMail(verifyMail);
        res.status(200).json({message: "Verification email sent"})
    } catch (error) {
        next(error)
    }
}


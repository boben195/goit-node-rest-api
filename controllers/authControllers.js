import User from "../models/users.js"

import bcrypt from "bcryptjs"


export const registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });
        
        if (user !== null) {
            return res.status(409).send({message: "Email already exist"})
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = await User.create({ email, password: passwordHash });
        
        res.status(201).json({
            email: newUser.email
        })
    }
    catch(error) {
        next(error)
    }
}


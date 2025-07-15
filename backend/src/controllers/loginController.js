import User from '../models/user_model.js';
import bcrypt from "bcrypt";

export const userLogin = async(req, res) => {
    const { userName, password } = req.body;

    try {
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(user.userName);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid username/password" });
        }
        
        res.status(201).json({
            message: "Login successful",
            role: user.role,
            userName: user.userName,
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
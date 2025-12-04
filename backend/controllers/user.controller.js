import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Register
export const register = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: "All filed are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        console.log(user);

        if (user) {
            return res.status(400).json({
                message: "User already exist",
                success: false,
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            role,
            password: hashPassword,
        });
        return res.status(200).json({
            message: `Account create Successfully ${fullname}`,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server error",
            success: false,
        });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const tokenData = {
            userId: user._id,
            role: user.role,
        };

        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        return res
            .status(200)
            .cookie("token", token, {
                httpOnly: true,
                // secure: false,
                // sameSite: "Lax",
                secure: true, // in production
                sameSite: "None", // production
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user: {
                    _id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role,
                },
                success: true,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

// logout

export const logout = async (_, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "Strict",
            secure: false,
        });

        return res.status(200).json({
            message: "User logout Successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

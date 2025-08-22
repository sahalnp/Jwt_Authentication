import { setCookie } from "../utils/setCookkie.js";
import User from "../models/userModel.js";
import { comparePassword, hashPassword } from "../utils/PasswordOperation.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/TokenGenerate.js";
import TokenModel from "../models/TokenModel.js";

export const login = async (req, res) => {
    try {
        const data = req.body;
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        }
        const hash = await comparePassword(data.password, user.password);
        if (!hash) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid credentials" });
        }
        const value = {
            name: user.name,
            email: user.email,
        };
        const payload = {
            userId: user._id,
            email: user.email,
        };

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        setCookie(res, accessToken, refreshToken);
        await TokenModel.create({ userId: user._id, refreshtoken: refreshToken });
        res.status(200).json({
            success: true,
            message: "User logged in",
            User: value,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const signup = async (req, res) => {
    try {
        const data = req.body;
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }
        data.password = await hashPassword(data.password);
        const newUser = await User.create(data);
        res.status(200).json({
            success: true,
            user: newUser,
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");
        await TokenModel.deleteMany({ userId: req.user._id });
        res.status(200).json({ success: true, message: "User logged out" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const getEmail = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({ success: true, email: user.email });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

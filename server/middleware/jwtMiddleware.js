import jwt from "jsonwebtoken";
import { setCookie } from "../utils/setCookkie.js";
import { generateAccessToken } from "../utils/TokenGenerate.js";

const verifyTokens = (req, res, next) => {
    const accessToken = req.cookies.accesstoken;
    const refreshToken = req.cookies.refreshtoken;

    // 1️⃣ Check refresh token first
    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: "Refresh token missing. Please login." });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, refreshUser) => {
        if (err) {
            return res
                .status(401)
                .json({ message: "Refresh token expired. Please login." });
        }

        // 2️⃣ If no access token at all
        if (!accessToken) {
            const newAccessToken = generateAccessToken({
                id: refreshUser.userId,
                email: refreshUser.email,
            });
            if (!newAccessToken) {
                console.log("Failed to generate new access token.");
                return;
            }

            setCookie(res, newAccessToken);
            req.user = refreshUser;
            return next();
        }

        // 3️⃣ Verify existing access token
        jwt.verify(accessToken, process.env.JWT_SECRET, (err2, user) => {
            if (err2) {
                if (err2.name === "TokenExpiredError") {
                    // 🔄 Access token expired → issue a new one using refresh token
                    const newAccessToken = generateAccessToken({
                        id: refreshUser.userId,
                        email: refreshUser.email
                    });
                    if (!newAccessToken) {
                        console.log("Failed to generate new access token.");
                        return;
                    }
                    setCookie(res, newAccessToken);
                    req.user = refreshUser;
                    return next();
                }
                return res
                    .status(403)
                    .json({ message: "Invalid access token." });
            }

            req.user = user;
            next();
        });
    });
};

export default verifyTokens;

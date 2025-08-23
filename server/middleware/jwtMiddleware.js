import jwt from "jsonwebtoken";
import { setCookie } from "../utils/setCookkie.js";
import { generateAccessToken } from "../utils/TokenGenerate.js";
import TokenModel from "../models/TokenModel.js";

const verifyTokens = async (req, res, next) => {
  const accessToken = req.cookies.accesstoken;
  const refreshToken = req.cookies.refreshtoken;

  if (!refreshToken) {
    res.clearCookie("accesstoken");
    res.clearCookie("refreshtoken");
    return res.status(401).json({ message: "Refresh token missing. Please login." });
  }

  try {
    // 🔍 Step 1: Check if refresh token exists in DB
    // const tokenDoc = await TokenModel.findOne({ refreshtoken: refreshToken });
    // if (!tokenDoc) {
    //   return res.status(401).json({ message: "Invalid or logged-out refresh token." });
    // }

    // 🔍 Step 2: Verify refresh token (check expiry)
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, refreshUser) => {
      if (err) {
        if (err === "TokenExpiredError") {
            console.log("sdjfklsdjfklsdjflkdsjfkldsfjkldsjfklsjfklds");
            
          res.clearCookie("accesstoken");
          res.clearCookie("refreshtoken");
        //   await TokenModel.deleteOne({ refreshtoken: refreshToken });
          return res.status(401).json({ message: "Refresh token expired. Please login." });
        }
        res.clearCookie("accesstoken");
        res.clearCookie("refreshtoken");
        // await TokenModel.deleteOne({ refreshtoken: refreshToken });
        return res.status(401).json({ message: "Refresh token expired. Please login." });
      }

      // 🟢 No access token? → issue new one
      if (!accessToken) {
        const newAccessToken = generateAccessToken({
          _id: refreshUser._id,
          email: refreshUser.email,
        });

        setCookie(res, newAccessToken);
        req.user = { _id: refreshUser._id, email: refreshUser.email };
        return next();
      }

      // 🔍 Step 3: Verify access token
      jwt.verify(accessToken, process.env.JWT_SECRET, async (err2, user) => {
        if (err2) {
          if (err2.name === "TokenExpiredError") {
            // ♻️ Access expired → issue new one using refresh
            const newAccessToken = generateAccessToken({
              _id: refreshUser._id,
              email: refreshUser.email,
            });

            setCookie(res, newAccessToken);
            req.user = { _id: refreshUser._id, email: refreshUser.email };
            return next();
          }
          return res.status(403).json({ message: "Invalid access token." });
        }

        // ✅ Access token valid
        req.user = { _id: user._id, email: user.email };
        next();
      });
    });
  } catch (err) {
    console.error("verifyTokens error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyTokens;

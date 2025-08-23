
// import jwt from "jsonwebtoken";
// import { setCookie } from "../utils/setCookkie.js";
// import { generateAccessToken } from "../utils/TokenGenerate.js";
// // import TokenModel from "../models/TokenModel.js";

// const verifyTokens = async (req, res, next) => {
//     try {
//         const accessToken = req.cookies.accesstoken;
//         const refreshToken = req.cookies.refreshtoken;

//         if (!refreshToken) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Refresh token missing. Please login.",
//             });
//         }
//         const tokenDoc = await TokenModel.findOne({
//             refreshtoken: refreshToken,
//         });
//         if (!tokenDoc) {
//             return res
//                 .status(401)
//                 .json({
//                     success: false,
//                     message: "Invalid or logged-out refresh token.",
//                 });
//         }

//         // ✅ Verify refresh token first
//         let refreshUser;
//         try {
//             refreshUser = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
//         } catch (err) {
//             res.cookie("accesstoken", "", { maxAge: 0 });
//             res.cookie("refreshtoken", "", { maxAge: 0 });

//             return res.status(401).json({
//                 success: false,
//                 message: "Refresh token expired or invalid. Please login.",
//             });
//         }

//         // ✅ If no access token, issue new one
//         if (!accessToken) {
//             const newAccessToken = generateAccessToken({
//                 _id: refreshUser._id,
//                 email: refreshUser.email,
//             });

//             setCookie(res, newAccessToken, refreshToken); // keep refresh token
//             req.user = { _id: refreshUser._id, email: refreshUser.email };
//             return next();
//         }

//         // ✅ Verify access token
//         try {
//             const user = jwt.verify(accessToken, process.env.JWT_SECRET);
//             req.user = { _id: user._id, email: user.email };
//             return next();
//         } catch (err2) {
//             if (err2.name === "TokenExpiredError") {
//                 // ♻️ Access token expired → issue new one using refresh
//                 const newAccessToken = generateAccessToken({
//                     _id: refreshUser._id,
//                     email: refreshUser.email,
//                 });

//                 setCookie(res, newAccessToken, refreshToken); // keep refresh token
//                 req.user = { _id: refreshUser._id, email: refreshUser.email };
//                 return next();
//             }

//             return res.status(403).json({
//                 success: false,
//                 message: "Invalid access token.",
//             });
//         }
//     } catch (err) {
//         console.error("verifyTokens error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// };

// export default verifyTokens;



import jwt from "jsonwebtoken";
import { setCookie } from "../utils/setCookkie.js";
import { generateAccessToken } from "../utils/TokenGenerate.js";
import TokenModel from "../models/TokenModel.js";

const verifyTokens = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accesstoken;
    const refreshToken = req.cookies.refreshtoken;

    if (!refreshToken) {
      res.cookie("accesstoken", "", { maxAge: 0 });
      return res.status(401).json({
        success: false,
        message: "Refresh token missing. Please login.",
      });
    }
    const tokenDoc = await TokenModel.findOne({ refreshtoken: refreshToken });
    let refreshUser;
    try {
      refreshUser = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
      await TokenModel.deleteOne({ refreshtoken: refreshToken });
      res.cookie("accesstoken", "", { maxAge: 0 });
      res.cookie("refreshtoken", "", { maxAge: 0 });

      return res.status(401).json({
        success: false,
        message: "Refresh token expired or invalid. Please login.",
      });
    }
    if (!accessToken) {
      const newAccessToken = generateAccessToken({
        _id: refreshUser._id,
        email: refreshUser.email,
      });

      setCookie(res, newAccessToken, refreshToken); 
      req.user = { _id: refreshUser._id, email: refreshUser.email };
      return next();
    }
    try {
      const user = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = { _id: user._id, email: user.email };
      return next();
    } catch (err2) {
      if (err2.name === "TokenExpiredError") {
        const newAccessToken = generateAccessToken({
          _id: refreshUser._id,
          email: refreshUser.email,
        });
        setCookie(res, newAccessToken, refreshToken);
        req.user = { _id: refreshUser._id, email: refreshUser.email };
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "Invalid access token.",
      });
    }
  } catch (err) {
    console.error("verifyTokens error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default verifyTokens;

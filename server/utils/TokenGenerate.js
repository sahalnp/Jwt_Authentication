// import jwt from "jsonwebtoken";
// import { v4 as uuidv4 } from "uuid";

// export const generateAccessToken = (user) => {
//   const accessUniqueId = uuidv4();

//   return jwt.sign(
//     { _id: user._id, email: user.email, uniqueId: accessUniqueId },
//     process.env.JWT_SECRET,
//     { expiresIn: "15m" }
//   );
// };
// export const generateRefreshToken = (user) => {
//   const refreshUniqueId = uuidv4();
//   return jwt.sign(
//     { _id: user._id, email: user.email, uniqueId: refreshUniqueId },
//     process.env.REFRESH_SECRET,
//     { expiresIn: "7d" }
//   );
// };


import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const generateAccessToken = (user) => {
  const accessUniqueId = uuidv4();

  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      uniqueId: accessUniqueId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15s" } 
  );
};

export const generateRefreshToken = (user) => {
  const refreshUniqueId = uuidv4();

  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      uniqueId: refreshUniqueId,
    },
    process.env.REFRESH_SECRET,
    { expiresIn: "30s" } 
  );
};

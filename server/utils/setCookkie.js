export const setCookie = (res, accesstoken, refreshtoken) => {
    res.cookie("accesstoken", accesstoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, 
  });
    res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, 
  });
};

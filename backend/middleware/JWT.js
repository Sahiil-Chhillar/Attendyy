import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const tokenObj = req.cookies.token;

  if (!tokenObj || !tokenObj.accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(tokenObj.accessToken, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const generateToken = (payload) => {
  return {
    accessToken: jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    }),
    refreshToken: jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    }),
  };
};

const JWT = {
  verifyToken,
  generateToken,
};

export default JWT;
import jwt from "jsonwebtoken";
const userAuth = async (req, res, next) => {
  const token =
    req.cookies.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied - No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default userAuth;

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];//Bearer eyJhbGciOiJIUzI1NiIs

  if (!token) {
    return res.status(401).send({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.student = decoded;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Invalid token",
      error: error.message,
    });
  }
};

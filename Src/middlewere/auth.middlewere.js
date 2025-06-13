import jwt from "jsonwebtoken";

// ✅ Verify token and attach user to req
export const verifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No or invalid token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token",
      });
    }

    req.user = decoded; // decoded: { id, email, role }
    next();
  });
};

// ✅ Role checkers
export const isAdminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const isTraderMiddleware = (req, res, next) => {
  if (req.user.role !== "trader") {
    return res.status(403).json({ message: "Trader access only" });
  }
  next();
};

export const isCustomerMiddleware = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Customer access only" });
  }
  next();
};

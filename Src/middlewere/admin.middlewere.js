export const isAdmin = (req, res, next) => {
    const { email } = req.user; // Assuming user info is added to `req.user` after verifying token
  
    if (email !== "farhansmit0318@gmail.com") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  
    next();
  };
  
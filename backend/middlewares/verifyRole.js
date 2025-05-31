const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user?.role) {
        return res.status(403).json({ message: "No role assigned" });
      }
      const rolesArray = allowedRoles.flat();
  
      if (!rolesArray.includes(req.user.role)) {
        return res.status(403).json({ message: "Unauthorized role" });
      }
  
      next();
    };
  };

  module.exports = verifyRole;
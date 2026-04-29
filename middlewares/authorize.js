// create a middleware function to check if the user has the required role to access a route and it can contain multiple roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // assuming req.user is set by the authenticateToken middleware
    console.log(`The Role is: ${userRole}`)
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: You do not have the required role to access this resource" });
    }
    next();
  };
};

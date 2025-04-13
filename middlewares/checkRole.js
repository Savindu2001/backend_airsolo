const checkRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      console.warn('Access denied: No user role found.');
      return res.status(403).json({ message: 'Access denied. No role found.' });
    }

    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!rolesArray.includes(user.role)) {
      console.warn(`Access denied: ${user.role} is not in [${rolesArray.join(', ')}]`);
      return res.status(403).json({ message: 'Access denied. Insufficient role.' });
    }

    next();
  };
};

module.exports = checkRole;

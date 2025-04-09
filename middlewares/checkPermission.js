const { RolePermission, Permission } = require('../models');

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      console.log('User object:', req.user); // Log user object

      const userRole = req.user.role; 

      if (!userRole) {
        return res.status(403).json({ message: 'User role is undefined' });
      }

      const permission = await Permission.findOne({ where: { name: requiredPermission } });
      if (!permission) {
        return res.status(403).json({ message: 'Permission not found' });
      }

      const hasPermission = await RolePermission.findOne({
        where: {
          role: userRole,
          permission_id: permission.id
        }
      });

      if (!hasPermission) {
        return res.status(403).json({ message: 'Access denied. You do not have the required permission.' });
      }

      next(); // User has permission
    } catch (error) {
      console.error('Permission check failed:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
};

module.exports = { checkPermission };

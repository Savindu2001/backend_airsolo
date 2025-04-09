// models/Permission.js
module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
    }, {
        tableName: 'permissions', // Ensure the correct table name
    });

    Permission.associate = (models) => {
        // Define the association with RolePermission
        Permission.hasMany(models.RolePermission, {
            foreignKey: 'permission_id',
            as: 'rolePermissions', // Alias for the association
        });
    };

    return Permission;
};

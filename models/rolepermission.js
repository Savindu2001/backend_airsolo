// models/RolePermission.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class RolePermission extends Model {
        static associate(models) {
            // Define associations
            RolePermission.belongsTo(models.Permission, {
                foreignKey: 'permission_id',
                as: 'permission', // Alias for the association
            });
        }
    }

    RolePermission.init({
        role: {
            type: DataTypes.STRING ,
            allowNull: false,
        },
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'permissions', // Table name
                key: 'id', // Reference key in Permission table
            },
        },
    }, {
        sequelize,
        modelName: 'RolePermission',
        tableName: 'role_permissions', // Ensure the correct table name
    });

    return RolePermission;
};

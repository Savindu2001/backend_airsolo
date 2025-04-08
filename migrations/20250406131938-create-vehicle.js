'use strict';


module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      vehicle_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
      },
      vehicleTypeId: {
           type: Sequelize.UUID,
           references: {
             model: 'vehicle_types',
             key: 'id',
           },
           allowNull: false,
           onDelete: 'CASCADE', 
           onUpdate: 'CASCADE', 
         },
      number_of_seats: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehicles');
  },
};

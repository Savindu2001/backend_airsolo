'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('permissions', [
      { name: 'manage_users', createdAt: new Date(), updatedAt: new Date() },
      { name: 'create_booking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'view_bookings', createdAt: new Date(), updatedAt: new Date() },
      { name: 'manage_hotels', createdAt: new Date(), updatedAt: new Date() },
      { name: 'view_assigned_trips', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};

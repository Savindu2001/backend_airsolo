'use strict';

const bcrypt = require('bcrypt'); // For password hashing

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        country: 'USA',
        username: 'johnny',
        password: await bcrypt.hash('password123', 10), // Hashing the password
        role: 'traveler',
        profile_photo: 'http://example.com/photos/john_doe.jpg',
        nic: null, // Not applicable for traveler
        driving_license_id: null, // Not applicable for traveler
        created_at: new Date(), // Use snake_case here
        updated_at: new Date(), // Use snake_case here
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        country: 'Canada',
        username: 'janesmith',
        password: await bcrypt.hash('password123', 10),
        role: 'hotelier',
        profile_photo: 'http://example.com/photos/jane_smith.jpg',
        nic: '123456789V', // Sample NIC for hotelier
        driving_license_id: null, // Not applicable for hotelier
        created_at: new Date(), // Use snake_case here
        updated_at: new Date(), // Use snake_case here
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@example.com',
        country: 'UK',
        username: 'bobdriver',
        password: await bcrypt.hash('password123', 10),
        role: 'driver',
        profile_photo: 'http://example.com/photos/bob_johnson.jpg',
        nic: null, // Not applicable for driver
        driving_license_id: 'D1234567890', // Sample Driving License ID for driver
        created_at: new Date(), // Use snake_case here
        updated_at: new Date(), // Use snake_case here
      },
      {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@example.com',
        country: 'Australia',
        username: 'aliceadmin',
        password: await bcrypt.hash('adminpassword', 10),
        role: 'admin',
        profile_photo: 'http://example.com/photos/alice_brown.jpg',
        nic: null, // Not applicable for admin
        driving_license_id: null, // Not applicable for admin
        created_at: new Date(), // Use snake_case here
        updated_at: new Date(), // Use snake_case here
      },
      {
        firstName: 'Mark',
        lastName: 'White',
        email: 'mark.white@example.com',
        country: 'Germany',
        username: 'markstaff',
        password: await bcrypt.hash('password123', 10),
        role: 'staff',
        profile_photo: 'http://example.com/photos/mark_white.jpg',
        nic: null, // Not applicable for staff
        driving_license_id: null, // Not applicable for staff
        created_at: new Date(), // Use snake_case here
        updated_at: new Date(), // Use snake_case here
      },
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  async down(queryInterface, Sequelize) {
    // Optional: Define the logic for reverting the seed
    await queryInterface.bulkDelete('users', null, {});
  }
};

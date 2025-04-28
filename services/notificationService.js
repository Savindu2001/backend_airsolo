
const admin = require('firebase-admin');
const { User } = require('../models');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }

// Notify driver about new booking
exports.notifyDriver = async (driverId, data) => {
  try {
    const driver = await User.findByPk(driverId);
    if (!driver || !driver.fcmToken) return;

    const message = {
      notification: {
        title: 'New Ride Request',
        body: `From ${data.pickupLocation} to ${data.dropLocation} (${data.distance}km)`,
      },
      data: {
        type: 'new_booking',
        bookingId: data.bookingId,
        pickupLocation: data.pickupLocation,
        dropLocation: data.dropLocation,
        distance: data.distance.toString(),
        fare: data.fare.toString(),
        vehicleType: data.vehicleType
      },
      token: driver.fcmToken
    };

    await admin.messaging().send(message);
  } catch (error) {
    console.error('Error sending notification to driver:', error);
  }
};

// Notify user about booking status
exports.notifyUser = async (userId, payload) => {
  try {
    const user = await User.findByPk(userId);
    if (!user || !user.fcmToken) return;

    const message = {
      notification: payload.notification ? {
        title: payload.notification.title,
        body: payload.notification.body
      } : undefined,
      data: payload.data,
      token: user.fcmToken
    };

    await admin.messaging().send(message);
  } catch (error) {
    console.error('Error sending notification to user:', error);
  }
};
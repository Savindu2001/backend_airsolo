const admin = require('firebase-admin'); // Ensure Firebase Admin is set up
const { sendEmailWithLink } = require('../utils/verifyEmail'); // Import the sendEmailWithLink function

// Send email verification
exports.sendEmailVerification = async (email, res) => {
    if (!email) {
        return res.status(400).json({ message: 'Email is required' }); // Use res to send an error response
    }

    try {
        const user = await admin.auth().getUserByEmail(email);
        const link = await admin.auth().generateEmailVerificationLink(email);
        await sendEmailWithLink(email, link); // Call the sendEmailWithLink function
        console.log(`Verification email sent to ${email}`);
        return res.status(200).json({ message: 'Verification email sent successfully' }); // Success response
    } catch (error) {
        console.error('Error sending verification email:', error);
        return res.status(500).json({ message: 'Failed to send verification email', error: error.message }); // Error response
    }
};

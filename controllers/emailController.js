const admin = require('firebase-admin'); // Ensure Firebase Admin is set up
const { sendEmailWithLink } = require('../utils/verifyEmail'); // Import the sendEmailWithLink function

// Send email verification
exports.sendEmailVerification = async (email, res) => {
    if (!email) {
        return res.status(400).json({ message: 'Email is required' }); // Use res to send an error response
    }

    // Validate email format (matches your Flutter validation)
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false,
            message: 'Invalid email address format'
        });
    }

    try {
        const user = await admin.auth().getUserByEmail(email);
        const link = await admin.auth().generateEmailVerificationLink(email);
        await sendEmailWithLink(email, link); 
        console.log(`Verification email sent to ${email}`);
        return res.status(200).json({ message: 'Verification email sent successfully' }); 
    } catch (error) {
        console.error('Error sending verification email:', error);

        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ 
                success: false,
                message: 'User not found. Please register first.' 
            });
        }
        
        if (error.code === 'auth/invalid-email') {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email address format'
            });
        }
        return res.status(500).json({ message: 'Failed to send verification email', error: error.message }); 
    }
};


// cehck email verified or not

exports.checkEmailVerification = async (req, res) => {
    const { email } = req.body;
  
  try {
    const user = await admin.auth().getUserByEmail(email);
    return res.status(200).json({
      verified: user.emailVerified,
      message: user.emailVerified ? 'Email verified' : 'Email not verified yet'
    });
  } catch (error) {
    console.error('Error checking verification:', error);
    return res.status(500).json({
      verified: false,
      message: 'Error checking verification status'
    });
  }
};
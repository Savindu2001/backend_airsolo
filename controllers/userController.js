const { User } = require('../models'); // Import the User model
const bcrypt = require('bcrypt'); // For password hashing
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({ 
    region: 'ap-southeast-1', // Correct region for your bucket
    endpoint: 'https://s3.ap-southeast-1.amazonaws.com' // Optional: Not needed in most cases
}); 
const admin = require('../services/firebaseService');
const transporter = require('../config/nodemailer');
const jwt = require("jsonwebtoken");

// Controller to create a new user
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, country, gender, username, password, role, profile_photo, nic, driving_license_id } = req.body;

        // Check if the required fields are present
        if (!firstName || !lastName || !email || !username || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`,
        });

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            id: userRecord.uid,
            firstName,
            lastName,
            email,
            country,
            gender,
            username,
            password: hashedPassword,
            role,
            profile_photo,
            nic,
            driving_license_id,
        });

        return res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'An error occurred while creating the user', error });
    }
};

// Controller to get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'An error occurred while fetching users', error });
    }
};

// Controller to get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the user', error });
    }
};

// Controller to update a user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, country, username, password, role, profile_photo, nic, driving_license_id } = req.body;

        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Update user fields
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.country = country || user.country;
        user.username = username || user.username;
        user.role = role || user.role;
        user.profile_photo = profile_photo || user.profile_photo;
        user.nic = nic || user.nic;
        user.driving_license_id = driving_license_id || user.driving_license_id;

        await user.save(); // Save the updated user

        return res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'An error occurred while updating the user', error });
    }
};

// Controller to delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy(); // Delete the user

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'An error occurred while deleting the user', error });
    }
};

// Controller to update user profile photo
exports.updateProfilePhoto = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the user
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.file) {
            user.profile_photo = req.file.location; 
        }

        await user.save(); 

        return res.status(200).json({ message: 'Profile photo updated successfully', user });
    } catch (error) {
        console.error('Error updating profile photo:', error);
        return res.status(500).json({ message: 'An error occurred while updating the profile photo', error });
    }
};



exports.deleteProfilePhoto = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the user
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (!user.profile_photo) {
        return res.status(404).json({ message: 'No profile photo to delete' });
      }
  
      // Extract the key from the profile photo URL.
    //   const key = user.profile_photo.split('/').pop();

    // Use URL object to extract the key (object path)
    const urlObj = new URL(user.profile_photo);
    // urlObj.pathname gives "/profile_photos/filename.jpg" so remove the leading slash
    const key = urlObj.pathname.substring(1);
  
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      };
  
      await s3Client.send(new DeleteObjectCommand(deleteParams));
  
      // Clear the profile photo field and save
      user.profile_photo = 'http://yourprofileimage.png';
      await user.save();
  
      return res.status(200).json({ message: 'Profile photo deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      return res.status(500).json({ message: 'An error occurred while deleting the profile photo', error: error.message });
    }
  };



// Password Reset Using firebase

exports.forgotPassword = async (req, res ) => {

    const {email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {

       const link = await admin.auth().generatePasswordResetLink(email);

       // Send the email using Nodemailer
       const mailOptions = {
    from: `"Air Solo Service" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${link}">here</a> to reset your password.</p>`
};


        // Send mail
        await transporter.sendMail(mailOptions);

       console.log(`Password reset link sent to ${email}: ${link}`);
        return res.status(200).json({ message: 'Password reset email sent' });
        
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return res.status(500).json({ message: 'Failed to send password reset email', error: error.message });
    }
};



/// Password reset update

exports.resetPassword = async (req, res) => {
    const { uid, newPassword } = req.body; // uid: Firebase user ID, newPassword: New password

    if (!uid || !newPassword) {
        return res.status(400).json({ message: 'User ID and new password are required' });
    }

    try {
        // Update password in Firebase
        await admin.auth().updateUser(uid, {
            password: newPassword,
        });

        // Update password in MySQL
        const user = await User.findOne({ where: { firebase_uid: uid } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password before saving
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save(); 

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Failed to reset password', error: error.message });
    }
};
 



// Send email verification controller
exports.sendEmailVerification = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Get the Firebase user
        const user = await admin.auth().getUserByEmail(email);

        // Generate the email verification link
        const link = await admin.auth().generateEmailVerificationLink(email);

        // Send email with Nodemailer
        await sendEmailWithLink(email, link);

        res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
        console.error('Error sending verification email:', error);
        res.status(500).json({ message: 'Failed to send verification email', error: error.message });
    }
};

// Helper function to send email (you can also move this to a separate utils/mail.js file)
const sendEmailWithLink = async (email, link) => {

    const mailOptions = {
        from: `"AirSolo Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Email Verification</h2>
                <p>Thank you for registering. Please click the link below to verify your email address:</p>
                <a href="${link}" style="background: #1e90ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};




/// Login 

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Verify Firebase credentials (using your logic)
        const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Check if user exists in MySQL
        const dbUser = await User.findOne({ where: { email } });
        if (!dbUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate JWT
        const token = jwt.sign(
            { uid: dbUser.id, email: dbUser.email, role: dbUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Token expires in 1 day
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                uid: dbUser.id,
                email: dbUser.email,
                role: dbUser.role,
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
                profile_photo: dbUser.profile_photo,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed", error: error.message });
    }
};


exports.socialLogin = async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: "ID token is required" });
    }

    try {
        // ✅ Verify Firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // 🔍 Check if user exists in MySQL
        let user = await User.findByPk(uid);

        if (!user) {
            // 🆕 Create new user in MySQL if not exists
            user = await User.create({
                id: uid,
                email,
                firstName: name?.split(" ")[0] || "",
                lastName: name?.split(" ")[1] || "",
                profile_photo: picture,
                country: "Australia", // default or from frontend
                role: "user",
                password: null, // or mark as social login
            });
        }

        // 🎫 Create JWT (optional)
        const token = jwt.sign({ uid: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({
            message: "Login successful",
            token,
            user,
        });
    } catch (error) {
        console.error("Social login error:", error);
        return res.status(500).json({ message: "Social login failed", error: error.message });
    }
};




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
const emailController = require('./emailController');








// Register New User
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, country, gender, username, password, role, profile_photo, nic, driving_license_id } = req.body;

        // Check Validation with Backend
        if (!firstName || !lastName || !email || !username || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if email or username already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        

        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: `${firstName} ${lastName}`,
            emailVerified: false 
        });

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in your database
        const user = await User.create({
            id: userRecord.uid,
            firstName,
            lastName,
            email,
            country,
            gender,
            username,
            password: hashedPassword,
            role: role || 'traveler', 
            profile_photo,
            nic,
            driving_license_id,
        });

        // Send verification email
        await emailController.sendEmailVerification(email, res);

        // Don't return the hashed password in the response
        const userResponse = { ...user.toJSON() };
        delete userResponse.password;

        return res.status(200).json({ 
            message: 'User created successfully', 
            user: userResponse 
        });
        
    } catch (error) {
        console.error('Error creating user:', error);
        
        // Handle specific Firebase errors
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ message: 'Email already in use' });
        }
        
        // Handle other specific errors as needed
        
        return res.status(500).json({ 
            message: 'An error occurred while creating the user', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
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
    const { uid, newPassword } = req.body; 

    if (!uid || !newPassword) {
        return res.status(400).json({ message: 'User ID and new password are required' });
    }

    try {
        // Update password in Firebase
        await admin.auth().updateUser(uid, {
            password: newPassword,
        });

        // Update password in MySQL
        const user = await User.findOne({ where: { id: uid } });
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
 










/// Login
exports.loginUser = async (req, res) => {
    const { token } = req.body; // Expecting token from the client
  
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
  
    try {
      // Verify the token
      const decodedToken = await admin.auth().verifyIdToken(token);
      const email = decodedToken.email;
  
      // Check if user exists in MySQL (REQUIRED)
      const dbUser = await User.findOne({ where: { email } });
      if (!dbUser) {
        return res.status(403).json({ 
          message: "User not registered in the system. Please sign up first." 
        });
      }

      // Generate your own JWT if needed
      const customToken = jwt.sign(
        { uid: dbUser.id, email: dbUser.email, role: dbUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      return res.status(200).json({
        message: "Login successful",
        token: customToken,
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
      
      // Handle specific Firebase errors
      if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({ message: "Token expired. Please log in again." });
      }
      if (error.code === 'auth/argument-error') {
        return res.status(400).json({ message: "Invalid token." });
      }
      
      return res.status(500).json({ 
        message: "Login failed", 
        error: process.env.NODE_ENV === 'development' ? error.message : undefined 
      });
    }
};

/// Social Login
exports.socialLogin = async (req, res) => {
    const { idToken, provider } = req.body;

    // Validate input
    if (!idToken || !provider) {
        return res.status(400).json({ 
            success: false,
            message: "ID token and provider are required" 
        });
    }

    try {
        // 1️⃣ Verify Firebase ID token with additional checks
        const decodedToken = await admin.auth().verifyIdToken(idToken, true); // Check revoked
        const { uid, email, name, picture, email_verified } = decodedToken;

        if (!email || !email_verified) {
            return res.status(403).json({
                success: false,
                message: "Email not verified or not provided by provider"
            });
        }

        // 2️⃣ Find or create user with transaction
        const [user, created] = await User.findOrCreate({
            where: { id: uid },
            defaults: {
                id: uid,
                email,
                firstName: name?.split(" ")[0] || email.split("@")[0],
                lastName: name?.split(" ").slice(1).join(" ") || "",
                profile_photo: picture || `${process.env.DEFAULT_AVATAR_URL}?name=${encodeURIComponent(email)}`,
                provider,
                role: "user", // Or determine role based on business logic
                email_verified: true,
                last_login: new Date()
            },
            transaction: await sequelize.transaction() // Ensure atomic operation
        });

        // 3️⃣ Update user if not newly created
        if (!created) {
            await user.update({
                last_login: new Date(),
                profile_photo: picture || user.profile_photo
            }, { transaction });
        }

        // 4️⃣ Generate secure JWT with refresh token
        const token = jwt.sign(
            { 
                uid: user.id,
                email: user.email,
                role: user.role 
            }, 
            process.env.JWT_SECRET,
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1h',
                issuer: process.env.JWT_ISSUER 
            }
        );

        const refreshToken = jwt.sign(
            { uid: user.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // 5️⃣ Set secure HTTP-only cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 604800000 // 7 days
        });

        // 6️⃣ Commit transaction
        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profile_photo: user.profile_photo
            },
            // Only return tokens in development for testing
            ...(process.env.NODE_ENV !== 'production' && { 
                token, 
                refreshToken 
            })
        });

    } catch (error) {
        // Rollback transaction if it exists
        if (transaction) await transaction.rollback();
        
        console.error("Social login error:", error);

        // Handle specific Firebase errors
        if (error.code === 'auth/id-token-revoked') {
            return res.status(401).json({
                success: false,
                message: "Token revoked - please sign in again"
            });
        }

        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                success: false,
                message: "Token expired - please sign in again"
            });
        }

        return res.status(500).json({ 
            success: false,
            message: "Authentication failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};




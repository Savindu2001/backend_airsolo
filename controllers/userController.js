const { User } = require('../models'); // Import the User model
const bcrypt = require('bcrypt'); // For password hashing

// Controller to create a new user
exports.createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, country, username, password, role, profile_photo, nic, driving_license_id } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            firstName,
            lastName,
            email,
            country,
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

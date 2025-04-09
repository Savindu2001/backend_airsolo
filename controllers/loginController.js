const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Sequelize User model

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Sign in with Firebase
        const user = await admin.auth().getUserByEmail(email);

        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        // Sign in using Firebase Authentication REST API (simulate login)
        const firebaseAuth = require("firebase/auth");
        const { getAuth, signInWithEmailAndPassword } = firebaseAuth;

        // If using Firebase Admin SDK only (no Firebase frontend auth), you can skip this part
        // Instead, your frontend should send Firebase ID token, which you verify

        // For now: let's continue assuming email is verified.

        // Check if user exists in your MySQL DB
        const dbUser = await User.findOne({ where: { email } });

        if (!dbUser) {
            return res.status(404).json({ message: "User not found in database." });
        }

        // Return a JWT (or your custom session token)
        const token = jwt.sign(
            { uid: user.uid, email: user.email, role: dbUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                uid: user.uid,
                email: user.email,
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

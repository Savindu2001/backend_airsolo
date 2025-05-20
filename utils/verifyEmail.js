const nodemailer = require('nodemailer');
const transporter = require('../config/nodemailer');



// Helper function to send email
const sendEmailWithLink = async (email, link) => {
    const mailOptions = {
        from: `"AirSolo Tm" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Email Verification</h2>
                <p>Thank you for registering. Please click the link below to verify your email address:</p>
                <a href="${link}" style="background: #1e90ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                </br>
                <p>${link}</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmailWithLink };

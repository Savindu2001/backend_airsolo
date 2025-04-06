// middlewares/uploadProfilePhoto.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Ensure the region is set to the region where your bucket is located
const s3Client = new S3Client({ 
    region: 'ap-southeast-1', // Correct region for your bucket
    endpoint: 'https://s3.ap-southeast-1.amazonaws.com' // Optional: Not needed in most cases
}); 

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME, // Ensure this environment variable is set correctly
        // Remove the acl property since your bucket may not support it
        contentType: multerS3.AUTO_CONTENT_TYPE, // Automatically set the content type
        key: function (req, file, cb) {
            const uniqueName = `profile_photos/${Date.now()}_${file.originalname}`; // Generate a unique file name
            cb(null, uniqueName); // Pass the unique name to the callback
        }
    })
});

// Middleware for uploading a single profile photo
const uploadProfilePhoto = upload.single('profile_photo'); // Specify 'profile_photo' as the field name for the file

module.exports = { uploadProfilePhoto }; // Export the middleware

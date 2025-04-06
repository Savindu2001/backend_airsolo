// middlewares/uploadProfilePhoto.js
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

// Ensure the region is set to the region where your bucket is located
const s3Client = new S3Client({ 
    region: 'ap-southeast-1',
    endpoint: 'https://s3.ap-southeast-1.amazonaws.com'
 }); // Adjust this to your bucket's region

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.AWS_BUCKET_NAME,
        // Remove the acl property
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const uniqueName = `profile_photos/${Date.now()}_${file.originalname}`;
            cb(null, uniqueName);
        }
    })
});

// Middleware for uploading a single profile photo
const uploadProfilePhoto = upload.single('profile_photo'); // Use 'profile_photo' as the key

module.exports = { uploadProfilePhoto };

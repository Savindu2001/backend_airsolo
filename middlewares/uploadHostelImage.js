const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3');

// Set up Multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
});

// Middleware for uploading images
const uploadHostelImages = upload.fields([
  { name: 'gallery', maxCount: 6 }, // Gallery images
]);


// Custom upload function
const uploadToS3 = async (req, res, next) => {
    try {
        // Upload gallery images
        if (req.files.gallery) {
            req.body.gallery = [];
            for (const galleryFile of req.files.gallery) {
                const galleryImageKey = `hostels/${hostelId}/gallery/${Date.now()}_${galleryFile.originalname}`;

                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: galleryImageKey,
                        Body: galleryFile.buffer,
                        ContentType: galleryFile.mimetype, // Set the content type
                    })
                );

                // Set the URL for each gallery image
                req.body.gallery.push(`https://${process.env.AWS_BUCKET_NAME}.s3-ap-southeast-1.amazonaws.com/${galleryImageKey}`);
            }
        }

        next(); // Proceed to the next middleware (the controller)
    } catch (error) {
        console.error('Error uploading to S3:', error);
        return res.status(500).json({ message: 'Failed to upload images', error: error.message });
    }
};


module.exports = { uploadHostelImages, uploadToS3 };

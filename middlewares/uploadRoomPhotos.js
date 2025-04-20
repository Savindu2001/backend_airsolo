const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3');

// Set up Multer to store files in memory
const upload = multer({
  storage: multer.memoryStorage(),
});

// Middleware for uploading images
const uploadRoomImages = upload.fields([
  { name: 'images', maxCount: 4 }, // Gallery images
]);

// Custom upload function

const uploadToS3 = async (req, res, next) => {
    try {
        

        // Upload room images
        if (req.files.images) {
            req.body.images = [];
            for (const imagesFile of req.files.images) {
                const roomImagesKey = `Rooms/${Date.now()}_${imagesFile.originalname}`;

                await s3Client.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: roomImagesKey,
                        Body: imagesFile.buffer,
                        ContentType: imagesFile.mimetype, 
                    })
                );

                // Set the URL for each room image
                req.body.images.push(`https://${process.env.AWS_BUCKET_NAME}.s3-ap-southeast-1.amazonaws.com/${roomImagesKey}`);
            }
        }

        next(); // Proceed to the next middleware (the controller)
    } catch (error) {
        console.error('Error uploading to S3:', error);
        return res.status(500).json({ message: 'Failed to upload images', error: error.message });
    }
};


module.exports = { uploadRoomImages, uploadToS3 };

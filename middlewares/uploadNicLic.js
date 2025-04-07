const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client,DeleteObjectCommand, S3Client } = require('@aws-sdk/client-s3');



const S3Client = new S3Client({
    region: 'ap-southeast-1', 
    endpoint: 'https://s3.ap-southeast-1.amazonaws.com' 
});

const upload = multer ({
    storage : multerS3({
        s3 : s3Client,
        bucket : process.env.AWS_BUCKET_NAME,
        contentType : multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const userId = req.body.userId || 'unknown_user';
            const docType = file.fieldname.includes('license') ? 'driving_license' : 'nic';
            const side = file.fieldname.includes('front') ? 'front' : 'back';
            const uniqueName = `documents/${docType}/${userId}_${side}_${Date.now()}_${file.originalname}`;
            cb(null, uniqueName);
        }
    })
});

const uploadNicPhoto = upload.fields([
    { name: 'nic_front', maxCount: 1 },
    { name: 'nic_back', maxCount: 1 },
    { name: 'license_front', maxCount: 1 },
    { name: 'license_back', maxCount: 1 }
  ]);

module.exports = { uploadNicPhoto};
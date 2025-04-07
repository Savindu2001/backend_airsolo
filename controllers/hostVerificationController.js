const { HostVerification } = require('../models');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = new S3Client({ 
    region: 'ap-southeast-1', // Correct region for your bucket
});

exports.submitVerification = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from the URL parameters

    // Check if a verification record already exists for this user
    let verification = await HostVerification.findOne({ where: { userId } });

    // If not, create a new verification record
    if (!verification) {
      verification = await HostVerification.create({ userId });
    }

    // Update verification document URLs if files are uploaded
    if (req.files['nic_front']) {
      verification.nic_front = req.files['nic_front'][0].location; // Assign the uploaded file's URL
    }
    if (req.files['nic_back']) {
      verification.nic_back = req.files['nic_back'][0].location;
    }
    if (req.files['license_front']) {
      verification.license_front = req.files['license_front'][0].location;
    }
    if (req.files['license_back']) {
      verification.license_back = req.files['license_back'][0].location;
    }

    // Save the updated verification record
    await verification.save();

    return res.status(200).json({
      message: 'Verification submitted/updated successfully',
      verification,
    });
  } catch (error) {
    console.error('Error submitting verification:', error);
    return res.status(500).json({ message: 'An error occurred while submitting the verification', error });
  }
};
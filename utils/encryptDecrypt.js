const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ; 
const IV = process.env.IV ;
const crypto = require('crypto');


// Helper Function to encrypt and decrypt card number and cvv

function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
  
function decrypt(text) {
    try {
        // Convert the input ciphertext to a buffer (from hex or base64)
        const encryptedText = Buffer.from(text, 'hex'); // Assuming the text is in hex format

        // Initialize the decipher with the correct key and IV
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf-8'), Buffer.from(IV, 'utf-8'));

        // Decrypt the data
        let decrypted = decipher.update(encryptedText, null, 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (err) {
        console.error("Decryption error:", err);
        return null; // Return null if decryption fails
    }
}

  

  module.exports = {encrypt, decrypt};
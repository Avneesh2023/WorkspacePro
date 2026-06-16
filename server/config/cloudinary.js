const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configure Cloudinary only if credentials are provided
const hasCloudinaryCreds = 
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryCreds) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a file buffer either to Cloudinary or falls back to local uploads folder.
 * @param {Buffer} fileBuffer - File memory buffer
 * @param {string} originalName - Original name of the uploaded file
 * @returns {Promise<{ url: string, publicId: string }>} file details
 */
const uploadFileToCloud = (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    // 1. Check if Cloudinary credentials are available. If not, trigger fallback.
    if (!hasCloudinaryCreds) {
      console.log('Cloudinary credentials missing in .env. Falling back to local storage.');
      return handleLocalFallback(fileBuffer, originalName, resolve, reject);
    }

    // 2. Attempt Cloudinary upload via stream
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'workspacepro' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload failed, falling back to local storage:', error.message);
          return handleLocalFallback(fileBuffer, originalName, resolve, reject);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Helper to write buffer to local disk and return local URL.
 */
const handleLocalFallback = (fileBuffer, originalName, resolve, reject) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileExt = path.extname(originalName);
    const uniqueName = crypto.randomBytes(16).toString('hex') + fileExt;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, fileBuffer);

    // Serve via http://localhost:5000/uploads/<filename>
    const fileUrl = `http://localhost:5000/uploads/${uniqueName}`;

    resolve({
      url: fileUrl,
      publicId: `local-${uniqueName}`, // Use unique filename as placeholder for cloudinary publicId
    });
  } catch (err) {
    reject(new Error(`Failed to write local fallback file: ${err.message}`));
  }
};

/**
 * Deletes a file either from Cloudinary or from the local uploads directory.
 * @param {string} publicId - Cloudinary publicId or local identifier
 */
const deleteFileFromCloud = async (publicId) => {
  if (publicId.startsWith('local-')) {
    const fileName = publicId.replace('local-', '');
    const filePath = path.join(__dirname, '../uploads', fileName);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return { result: 'ok' };
    } catch (err) {
      console.error('Error deleting local file:', err.message);
      return { result: 'error' };
    }
  }

  if (hasCloudinaryCreds) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (err) {
      console.error('Error deleting from Cloudinary:', err.message);
      return { result: 'error' };
    }
  }

  return { result: 'ok' };
};

module.exports = {
  uploadFileToCloud,
  deleteFileFromCloud,
};

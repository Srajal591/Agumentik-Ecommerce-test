const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Upload image buffer to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer from multer
 * @param {String} folder - Cloudinary folder name (e.g., 'products', 'categories')
 * @returns {Promise<Object>} - Cloudinary upload result with secure_url
 */
const uploadToCloudinary = (fileBuffer, folder = 'fashion-store') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Delete image from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Cloudinary deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {String} url - Cloudinary image URL
 * @returns {String} - Public ID
 */
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const publicId = filename.split('.')[0];
  
  // Include folder path if exists
  const folderIndex = parts.indexOf('fashion-store');
  if (folderIndex !== -1) {
    return parts.slice(folderIndex).join('/').split('.')[0];
  }
  
  return publicId;
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
};

const multer = require('multer');
const path = require('path');

// Store file as Buffer in memory for direct Cloudinary streaming
const storage = multer.memoryStorage();

// File type validation filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, PNG, JPG, JPEG, and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

module.exports = upload;

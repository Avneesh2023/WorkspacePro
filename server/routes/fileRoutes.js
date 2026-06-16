const express = require('express');
const router = express.Router();
const { uploadFile, getProjectFiles, deleteFile } = require('../controllers/fileController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// Protect all file management endpoints
router.use(protect);

// Routes
router.post('/upload', upload.single('file'), uploadFile);
router.get('/project/:projectId', getProjectFiles);
router.delete('/:id', deleteFile);

module.exports = router;

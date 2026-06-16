const File = require('../models/File');
const Project = require('../models/Project');
const { uploadFileToCloud, deleteFileFromCloud } = require('../config/cloudinary');

/**
 * Uploads a new file belonging to a project.
 * POST /api/files/upload
 */
exports.uploadFile = async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    // 1. Fetch project to check ownership
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // 2. Access control check
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You are not the project owner.' });
    }

    // 3. Upload file (Cloudinary or local fallback)
    const uploadResult = await uploadFileToCloud(req.file.buffer, req.file.originalname);

    // 4. Save metadata to DB
    const file = await File.create({
      ownerId: req.user.id,
      projectId,
      fileName: req.file.originalname,
      fileUrl: uploadResult.url,
      cloudinaryId: uploadResult.publicId,
      fileType: req.file.mimetype,
    });

    res.status(201).json(file);
  } catch (error) {
    console.error('File upload controller error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Gets all files belonging to a project.
 * GET /api/files/project/:projectId
 */
exports.getProjectFiles = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. Fetch project to check ownership
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // 2. Access control check
    if (project.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You are not the project owner.' });
    }

    // 3. Fetch files
    const files = await File.find({ projectId }).sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    console.error('Fetch project files error:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletes a file from project storage.
 * DELETE /api/files/:id
 */
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Access control check
    if (file.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You do not own this file.' });
    }

    // 1. Remove from cloud/local storage
    await deleteFileFromCloud(file.cloudinaryId);

    // 2. Remove metadata from DB
    await file.deleteOne();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: error.message });
  }
};

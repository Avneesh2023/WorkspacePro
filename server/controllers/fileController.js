const File = require('../models/File');
const Project = require('../models/Project');
const { uploadFileToCloud, deleteFileFromCloud } = require('../config/cloudinary');

/**
 * Uploads a new file belonging to a project.
 * POST /api/files/upload
 */
exports.uploadFile = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    if (!req.file) {
      const error = new Error('No file uploaded');
      error.statusCode = 400;
      return next(error);
    }

    if (!projectId) {
      const error = new Error('projectId is required');
      error.statusCode = 400;
      return next(error);
    }

    // 1. Fetch project to check ownership
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      return next(error);
    }

    // 2. Access control check
    if (project.ownerId.toString() !== req.user.id) {
      const error = new Error('Access denied. You are not the project owner.');
      error.statusCode = 403;
      return next(error);
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

    res.status(201).json({
      success: true,
      data: file,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Gets all files belonging to a project.
 * GET /api/files/project/:projectId
 */
exports.getProjectFiles = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    // 1. Fetch project to check ownership
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      return next(error);
    }

    // 2. Access control check
    if (project.ownerId.toString() !== req.user.id) {
      const error = new Error('Access denied. You are not the project owner.');
      error.statusCode = 403;
      return next(error);
    }

    // 3. Fetch files
    const files = await File.find({ projectId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a file from project storage.
 * DELETE /api/files/:id
 */
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      const error = new Error('File not found');
      error.statusCode = 404;
      return next(error);
    }

    // Access control check
    if (file.ownerId.toString() !== req.user.id) {
      const error = new Error('Access denied. You do not own this file.');
      error.statusCode = 403;
      return next(error);
    }

    // 1. Remove from cloud/local storage
    await deleteFileFromCloud(file.cloudinaryId);

    // 2. Remove metadata from DB
    await file.deleteOne();

    res.json({
      success: true,
      data: { message: 'File deleted successfully' },
    });
  } catch (error) {
    next(error);
  }
};

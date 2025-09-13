// backend/routes/pdfs.js
const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 🔒 All routes require authentication
router.use(authMiddleware);

// Upload PDF
router.post('/upload', upload.single('file'), pdfController.uploadPdf);

// List user's PDFs
router.get('/', pdfController.listPdfs);

// Get PDF metadata by UUID
router.get('/:uuid', pdfController.getPdfByUuid);

// ✅ Download PDF (streams the actual file, no .pdf in URL)
router.get('/:uuid/download', pdfController.downloadPdf);

// Rename PDF
router.put('/:uuid/rename', pdfController.renamePdf);

// Delete PDF
router.delete('/:uuid', pdfController.deletePdf);

module.exports = router;

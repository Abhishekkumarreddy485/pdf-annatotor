// controllers/pdfController.js
const fs = require('fs');
const path = require('path');
const PdfFile = require('../models/PdfFile');

// Upload
exports.uploadPdf = async (req, res) => {
  try {
    const pdf = new PdfFile({
      uuid: path.parse(req.file.filename).name,
      user: req.userId,
      filename: req.file.originalname,
      storedFilename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });
    await pdf.save();
    res.json(pdf);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// List PDFs
exports.listPdfs = async (req, res) => {
  try {
    const files = await PdfFile.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list PDFs', error: err.message });
  }
};

// Metadata
exports.getPdfByUuid = async (req, res) => {
  try {
    const file = await PdfFile.findOne({ uuid: req.params.uuid, user: req.userId });
    if (!file) return res.status(404).json({ message: 'Not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch PDF', error: err.message });
  }
};


// Download actual PDF file
exports.downloadPdf = async (req, res) => {
  try {
    const file = await PdfFile.findOne({ uuid: req.params.uuid, user: req.userId });
    if (!file) return res.status(404).json({ message: 'Not found' });

    const filePath = path.resolve(file.path);

    // ✅ Prevent caching
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/pdf');

    res.sendFile(filePath, (err) => {
      if (err) res.status(500).json({ message: 'Failed to send PDF', error: err.message });
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to download PDF', error: err.message });
  }
};



// Rename
exports.renamePdf = async (req, res) => {
  try {
    const file = await PdfFile.findOneAndUpdate(
      { uuid: req.params.uuid, user: req.userId },
      { filename: req.body.filename },
      { new: true }
    );
    if (!file) return res.status(404).json({ message: 'Not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: 'Failed to rename', error: err.message });
  }
};

// Delete
exports.deletePdf = async (req, res) => {
  try {
    const file = await PdfFile.findOneAndDelete({ uuid: req.params.uuid, user: req.userId });
    if (!file) return res.status(404).json({ message: 'Not found' });
    fs.unlinkSync(file.path);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete', error: err.message });
  }
};

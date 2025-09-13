// models/PdfFile.js
const mongoose = require('mongoose');

const pdfFileSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },      // original filename
  storedFilename: { type: String, required: true },// actual name on disk
  path: { type: String, required: true },
  size: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PdfFile', pdfFileSchema);

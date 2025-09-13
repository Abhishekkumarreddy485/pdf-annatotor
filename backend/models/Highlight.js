// models/Highlight.js
const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
  pdfUuid: { type: String, required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pageNumber: { type: Number, required: true },
  text: { type: String },
  // bounding box or position object: { x, y, width, height } or any shape you prefer
  position: { type: Object, required: true },
  meta: { type: Object }, // optional metadata (color, comment, etc)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

highlightSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Highlight', highlightSchema);

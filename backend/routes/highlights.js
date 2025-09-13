const express = require('express');
const router = express.Router();
const highlightController = require('../controllers/highlightController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Create highlight
router.post('/', highlightController.createHighlight);

// Get highlights for a PDF UUID
router.get('/:pdfUuid', highlightController.getHighlights);

// Update highlight
router.put('/:id', highlightController.updateHighlight);

// Delete highlight
router.delete('/:id', highlightController.deleteHighlight);

module.exports = router;

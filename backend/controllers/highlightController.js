const Highlight = require('../models/Highlight');

// Create highlight
exports.createHighlight = async (req, res) => {
  try {
    const data = req.body;
    const highlight = new Highlight({
      ...data,
      user: req.user.id
    });
    await highlight.save();
    res.json({ message: 'Highlight saved', highlight });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get highlights for a PDF UUID
exports.getHighlights = async (req, res) => {
  try {
    const { pdfUuid } = req.params;
    const highlights = await Highlight.find({ pdfUuid, user: req.user.id }).sort({ createdAt: 1 });
    res.json({ highlights }); // return as object { highlights: [...] }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update highlight
exports.updateHighlight = async (req, res) => {
  try {
    const highlight = await Highlight.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!highlight) return res.status(404).json({ message: 'Highlight not found' });
    res.json({ message: 'Updated', highlight });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete highlight
exports.deleteHighlight = async (req, res) => {
  try {
    const highlight = await Highlight.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!highlight) return res.status(404).json({ message: 'Highlight not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const router = require('express').Router();
const JournalEntry = require('../models/JournalEntry');
const authenticateToken = require('../middleware/auth');

// ➕ Create Journal Entry
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { date, textContent, stressTriggers } = req.body;
    const entry = new JournalEntry({
      userId: req.user.userId,
      date,
      textContent,
      stressTriggers: stressTriggers || [],
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating journal entry.' });
  }
});

// 📥 Get all journal entries for the authenticated user (optionally by date)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;
    const filter = { userId: req.user.userId };
    if (date) {
      filter.date = new Date(date);
    }

    const entries = await JournalEntry.find(filter).sort({ date: -1, createdAt: -1 });
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching journal entries.' });
  }
});

// 📄 Get a single Journal Entry by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found or unauthorized.' });
    }
    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching journal entry.' });
  }
});

// ✏️ Update a Journal Entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { date, textContent, stressTriggers } = req.body;
    const updatedEntry = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { date, textContent, stressTriggers },
      { new: true } // Return updated doc
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Journal entry not found or unauthorized.' });
    }
    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating journal entry.' });
  }
});

// ❌ Delete a Journal Entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!result) {
      return res.status(404).json({ message: 'Journal entry not found or unauthorized.' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting journal entry.' });
  }
});

module.exports = router;

const router = require('express').Router();
const MoodLog = require('../models/MoodLog');
const authenticateToken = require('../middleware/auth');

// ➕ Create or Update Mood Log for a given date
// POST /api/moods
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { date, moodType, notes } = req.body;

    const moodLog = new MoodLog({
      userId: req.user.userId,
      date,
      moodType,
      notes,
    });

    await moodLog.save();

    res.status(201).json(moodLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du log d’humeur.' });
  }
});

// 📥 Get Mood Logs (par jour ou par mois)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date, month, year } = req.query;
    const userId = req.user.userId;
    let filter = { userId };

    if (date) {
      filter.date = new Date(date);
    } else if (month && year) {
      const startDate = new Date(`${year}-${String(month).padStart(2, '0')}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      filter.date = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const moodLogs = await MoodLog.find(filter).sort({ date: -1 });
    res.status(200).json(moodLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching mood logs.' });
  }
});

// ✏️ Update Mood Log by ID
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { date, moodType, notes } = req.body;
    const updatedMood = await MoodLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { date, moodType, notes },
      { new: true }
    );

    if (!updatedMood) {
      return res.status(404).json({ message: 'Mood log not found or unauthorized.' });
    }

    res.status(200).json(updatedMood);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating mood log.' });
  }
});

// ❌ Delete Mood Log
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await MoodLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!result) {
      return res.status(404).json({ message: 'Mood log not found or unauthorized.' });
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting mood log.' });
  }
});

module.exports = router;
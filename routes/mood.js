const router = require('express').Router();
const MoodLog = require('../models/MoodLog');
const authenticateToken = require('../middleware/auth');

// ➕ Create or Update Mood Log for a given date
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { date, moodType } = req.body;

    // Recherche d'une entrée existante pour le même jour
    const existingMood = await MoodLog.findOne({
      userId: req.user.userId,
      date: new Date(date)
    });

    if (existingMood) {
      existingMood.moodType = moodType;
      await existingMood.save();
      return res.status(200).json(existingMood); // Mise à jour
    }

    // Création d'une nouvelle entrée
    const moodLog = new MoodLog({
      userId: req.user.userId,
      date,
      moodType
    });
    await moodLog.save();

    res.status(201).json(moodLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating or updating mood log.' });
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
      endDate.setMonth(endDate.getMonth() + 1); // Début du mois suivant

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
    const { date, moodType } = req.body;
    const updatedMood = await MoodLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { date, moodType },
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

    res.status(204).send(); // No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting mood log.' });
  }
});

module.exports = router;
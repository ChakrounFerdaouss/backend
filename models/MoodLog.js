const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // référence au modèle User
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  moodType: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

// Optionnel : empêcher plusieurs logs pour le même user à la même date
moodLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MoodLog', moodLogSchema);

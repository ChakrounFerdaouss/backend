const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  notes: {
    type: String,
    default: '', // champ facultatif mais utile
  }
}, {
  timestamps: true
});

// ❌ Supprimer la contrainte d'unicité qui bloque les doublons par date
// moodLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MoodLog', moodLogSchema);

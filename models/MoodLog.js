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
    default: '', // facultatif mais recommandé
  }
}, {
  timestamps: true
});

moodLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MoodLog', moodLogSchema);

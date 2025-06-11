const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  textContent: {
    type: String,
    required: true,
  },
  stressTriggers: {
    type: [String], // tableau de chaînes
    default: [],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);

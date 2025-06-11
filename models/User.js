const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // ajoute createdAt et updatedAt automatiquement
});

// Tu peux ajouter des méthodes ou hooks ici si nécessaire

module.exports = mongoose.model('User', userSchema);

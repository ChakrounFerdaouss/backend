const mongoose = require('mongoose');
require('dotenv').config();

const db = {};

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB (via models/index.js)'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Importation des modèles
db.User = require('./User');
db.MoodLog = require('./MoodLog');
db.JournalEntry = require('./JournalEntry');

module.exports = db;

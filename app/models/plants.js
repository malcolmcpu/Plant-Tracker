const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  light: {
    type: String,
    enum: ['low', 'medium', 'bright'],
    default: 'medium',
  },
  lastWatered: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Plant', plantSchema);

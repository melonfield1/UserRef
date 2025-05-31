const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referred: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  purchaseCompleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Referral', referralSchema);

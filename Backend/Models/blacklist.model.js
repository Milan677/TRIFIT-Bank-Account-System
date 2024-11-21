const mongoose = require('mongoose');

const BlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  blacklistedAt: { type: Date, default: Date.now },
});

const blacklistModel=mongoose.model('Blacklist', BlacklistSchema);

module.exports={blacklistModel}
const mongoose = require('../db');
const Schema = mongoose.Schema;

const TracklistSchema = new Schema ({
  id: {type: String, required: true},         // YouTube video ID
  tracklist: {type: String, required: true}   // identified tracklist
});

const model = mongoose.model('Tracklists', TracklistSchema);

module.exports = model;
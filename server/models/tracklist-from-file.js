const mongoose = require('../db');
const Schema = mongoose.Schema;

const TracklistFromFileSchema = new Schema ({
  fileName: {type: String, required: true},
  fileSize: {type: Number},
  tracklist: {type: String, required: true}
});

module.exports = mongoose.model('TracklistFromFile', TracklistFromFileSchema);

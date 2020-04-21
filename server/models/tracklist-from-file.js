const mongoose = require('../db');
const Schema = mongoose.Schema;

const TracklistFromFileSchema = new Schema ({
  fileName: {type: String, required: true},
  fileSize: {type: Number},
  tracklist: {type: String, required: true}
});

const model = mongoose.model('TracklistFromFile', TracklistFromFileSchema);

module.exports = model;
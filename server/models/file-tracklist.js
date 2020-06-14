const mongoose = require('../db');
const Schema = mongoose.Schema;

const FileTrackListSchema = new Schema ({
  fileName: {type: String, required: true},
  fileSize: {type: Number, required: true},
  tracklist: {type: String, required: true}
});

module.exports = mongoose.model('FileTrackList', FileTrackListSchema);

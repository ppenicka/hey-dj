const mongoose = require('../db');
const Schema = mongoose.Schema;

const TracklistFromYouTubeSchema = new Schema ({
  youTubeId: {type: String, required: true},
  tracklist: {type: String, required: true}
});

const model = mongoose.model('TracklistFromYouTube', TracklistFromYouTubeSchema);

module.exports = model;

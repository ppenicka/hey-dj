const mongoose = require('../db');
const Schema = mongoose.Schema;

const TracklistFromYouTubeSchema = new Schema ({
  youTubeId: {type: String, required: true},
  tracklist: {type: String, required: true}
});

module.exports = mongoose.model('TracklistFromYouTube', TracklistFromYouTubeSchema);

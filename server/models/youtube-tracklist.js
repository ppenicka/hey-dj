const mongoose = require('../db');
const Schema = mongoose.Schema;

const YouTubeTrackListSchema = new Schema ({
  youTubeId: {type: String, required: true},
  tracklist: {type: String, required: true}
});

module.exports = mongoose.model('YouTubeTrackList', YouTubeTrackListSchema);

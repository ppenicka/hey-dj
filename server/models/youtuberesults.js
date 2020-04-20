const mongoose = require('../db');
const Schema = mongoose.Schema;

const YouTubeResultSchema = new Schema ({
  youTubeId: {type: String, required: true},
  results: {type: String, required: true}
});

const model = mongoose.model('YouTubeResult', YouTubeResultSchema);

module.exports = model;
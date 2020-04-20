const mongoose = require('../db');
const Schema = mongoose.Schema;

const YouTubeResultsSchema = new Schema ({
  youTubeId: {type: String, required: true},
  results: {type: String, required: true}
});

const model = mongoose.model('Tracklists', YouTubeResultsSchema);

module.exports = model;
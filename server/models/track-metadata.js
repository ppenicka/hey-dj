const mongoose = require('../db');
const Schema = mongoose.Schema;

const TrackMetadataSchema = new Schema({
  acrid: {
    type: String,
    required: true
  },
  metadata: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('TrackMetadata', TrackMetadataSchema);

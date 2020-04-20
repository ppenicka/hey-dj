const mongoose = require('../db');
const Schema = mongoose.Schema;

const FileResultSchema = new Schema ({
  fileName: {type: String, required: true},
  fileSize: {type: Number},
  results: {type: String, required: true}
});

const model = mongoose.model('FileResult', FileResultSchema);

module.exports = model;
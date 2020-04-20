const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hey-dj', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

module.exports = mongoose;
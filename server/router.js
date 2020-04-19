const router = require('express').Router();
const identify = require('./services/fromfile');
const yt = require('./services/ytdownload');

router
  .post('/tracklist', identify.identifyFromFile);

router
  .post('/yt', yt.downloadYouTube)

module.exports = router;
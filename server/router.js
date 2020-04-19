const router = require('express').Router();
const identify = require('./services/identification');
const yt = require('./services/ytdownload');

router
  .post('/tracklist', identify.getTracklist);

router
  .get('/yt', yt.downloadYouTube)

module.exports = router;
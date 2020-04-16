const router = require('express').Router();
const identify = require('./services/Identification');

router
  .get('/tracklist', identify.getTracklist);

module.exports = router;
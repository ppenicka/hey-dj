const router = require('express').Router();
const identify = require('./services/Identification');

router
  .post('/tracklist', identify.getTracklist);

module.exports = router;
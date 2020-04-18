const router = require('express').Router();
const identify = require('./services/identification');

router
  .post('/tracklist', identify.getTracklist);

module.exports = router;
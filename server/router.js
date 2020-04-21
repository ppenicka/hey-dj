const router = require('express').Router();
const identify = require('./controllers/tracklist-from-file');
const yt = require('./controllers/tracklist-from-youtube');

router.post('/file', identify.identifyFromFile);
router.post('/youtube', yt.downloadYouTube);

module.exports = router;

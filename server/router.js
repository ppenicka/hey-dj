const router = require('express').Router();
const identify = require('./controllers/file-tracklist');
const yt = require('./controllers/youtube-tracklist');

router.post('/file', identify.identifyFromFile);
router.post('/youtube', yt.downloadYouTube);

module.exports = router;

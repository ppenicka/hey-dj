const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const getTracklist = require('../helpers/get-tracklist');
const TracklistFromYouTube = require('../models/tracklist-from-youtube');

function downloadYouTube (req, res) {
  const url = new URL(req.body.ytUrl);
  const youTubeId = url.searchParams.get('v');
  const interval = process.env.SEGMENT_INTERVAL || 240;
  const dirname = './tmp/' + youTubeId;
  const extension = 'mp3';
  const input = dirname + '.' + extension;

  TracklistFromYouTube.find({ youTubeId: youTubeId }).then((cached) => {

    if (cached.length > 0) {
      res.status(200).send(cached[0]['tracklist']);
    } else {
      const YD = new YoutubeMp3Downloader({
        'ffmpegPath': '/usr/bin/ffmpeg',
        'outputPath': './tmp',
        'youtubeVideoQuality': 'lowest',
        'queueParallelism': 4,
        'progressTimeout': 2000
      });

      YD.download(youTubeId, youTubeId + '.mp3');

      YD.on('finished', function () {
        getTracklist(input, dirname, extension, interval).then((results) => {
          TracklistFromYouTube.create({
            youTubeId: youTubeId,
            tracklist: JSON.stringify(results)
          });
          res.status(200).send(results);
        });
      });

      YD.on('error', function (error) {
        console.log(error);                     // eslint-disable-line no-console
      });

      YD.on('progress', function (progress) {
        console.log(JSON.stringify(progress));  // eslint-disable-line no-console
      });
    }
  });
}

module.exports = { downloadYouTube };

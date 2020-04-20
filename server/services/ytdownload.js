const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { getTracklist } = require('./gettracklist');
const tlDb = require('../models/tracklist');

function downloadYouTube (req, res) {
  console.log(req.body);

  const url = new URL(req.body.ytUrl);
  const id = url.searchParams.get("v");
  const interval = 240;
  const dirname = './tmp/' + id;
  const extension = 'mp3';
  const input = dirname + '.' + extension;

  const YD = new YoutubeMp3Downloader({
    "ffmpegPath": "/usr/bin/ffmpeg",
    "outputPath": "./tmp",
    "youtubeVideoQuality": "lowest",
    "queueParallelism": 4,
    "progressTimeout": 2000
  });

  YD.download(id, id + '.mp3');

  YD.on("finished", function (err, data) {
    getTracklist(input, dirname, extension, interval).then((results) => {
      res.status(200).send(results);
    });
  });

  YD.on("error", function (error) {
    console.log(error);
  });

  YD.on("progress", function (progress) {
    console.log(JSON.stringify(progress));
  });
}

module.exports = { downloadYouTube };

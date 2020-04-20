const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { getTracklist } = require('./gettracklist');
const youTubeResult = require('../models/youtuberesults');

function downloadYouTube (req, res) {

  const url = new URL(req.body.ytUrl);
  const youTubeId = url.searchParams.get("v");
  const interval = 240;
  const dirname = './tmp/' + youTubeId;
  const extension = 'mp3';
  const input = dirname + '.' + extension;

  youTubeResult.find({ youTubeId: youTubeId }).then((cached) => {

    if (cached.length > 0) {
      res.status(200).send(cached[0]['results']);
    } else {
      const YD = new YoutubeMp3Downloader({
        "ffmpegPath": "/usr/bin/ffmpeg",
        "outputPath": "./tmp",
        "youtubeVideoQuality": "lowest",
        "queueParallelism": 4,
        "progressTimeout": 2000
      });

      YD.download(youTubeId, youTubeId + '.mp3');

      YD.on("finished", function (err, data) {
        getTracklist(input, dirname, extension, interval).then((results) => {
          youTubeResult.create({ youTubeId: youTubeId, results: JSON.stringify(results) });
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
  })
}

module.exports = { downloadYouTube };

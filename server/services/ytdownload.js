const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { getTracklist } = require('./gettracklist');

function downloadYouTube (req, res) {
  const url = new URL(req.body.ytUrl);
  const id = url.searchParams.get("v");
  const interval = 240;
  const dirname = './tmp/' + id;
  const extension = 'mp3';
  const input = dirname + extension;

  const YD = new YoutubeMp3Downloader({
    "ffmpegPath": "/usr/bin/ffmpeg",
    "outputPath": "./tmp",
    "youtubeVideoQuality": "lowest",
    "queueParallelism": 2,
    "progressTimeout": 2000
  });

  YD.download(id, id + '.mp3');

  YD.on("finished", function (err, data) {
    getTracklist(input, dirname, extension, interval, res);
  });

  YD.on("error", function (error) {
    console.log(error);
  });

  YD.on("progress", function (progress) {
    console.log(JSON.stringify(progress));
  });
}

module.exports = { downloadYouTube };

const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ffmpeg = require('ffmpeg');
const fs = require('fs');
const requestMetadata = require('./acrcloudclient');
const shortid = require('shortid');

const YD = new YoutubeMp3Downloader({
  "ffmpegPath": "/usr/bin/ffmpeg",
  "outputPath": "./tmp",
  "youtubeVideoQuality": "lowest",
  "queueParallelism": 2,
  "progressTimeout": 2000
});


function downloadYouTube (req, res) {
  const url = new URL(req.body.ytUrl);
  const id = url.searchParams.get("v");

  YD.download(id, id + '.mp3');

  const results = [];
  const interval = 240;
  let length = 0;
  let segments = 0;

  const basename = id;
  const extension = 'mp3';
  const input = './tmp/' + basename + '.' + extension;
  const dirname = id;



  YD.on("finished", function (err, data) {
    fs.mkdirSync(dirname);
    const source = new ffmpeg(input);
    source.then((audio) => {
      length = audio.metadata.duration['seconds'];
      segments = Math.floor((length - 60) / interval);

      // identify segments
      for (let i = 0; i < segments; i++) {
        results[i] = identifySegment(source, 60 + i * interval, 72 + i * interval, `${dirname}/${i}.${extension}`);
      }

      // second try for unidentified
      Promise.all(results).then((results) => {
        for (let i = 0; i < segments; i++) {
          if (results[i].status.code === 1001) {
            results[i] = identifySegment(source, 60 + i * interval + Math.floor(interval / 2), 72 + i * interval + Math.floor(interval / 2), `${dirname}/${i}.${extension}`);
          }
        }

        // merge duplicate results
        Promise.all(results).then((results) => {
          let i = 0;
          while (i < segments - 1) {
            if ((results[i].status.code !== 0) && (results[i + 1].status.code !== 0) ||
                ((results[i].status.code === 0) && (results[i + 1].status.code === 0) &&
                (results[i].metadata.music[0].title === results[i + 1].metadata.music[0].title) &&
                (results[i].metadata.music[0].duration === results[i + 1].metadata.music[0].duration))) {
              results.splice(i + 1, 1);
              segments--;
            } else i++;
          }

          console.log('######## Identified tracklist: ########');
          for (let i = 0; i < segments; i++) {
            if (results[i].status.code === 0) {
              console.log(`Track #${i + 1}: ${results[i].metadata.music[0].artists[0].name} - ${results[i].metadata.music[0].title}`);
            } else {
              console.log(`Track #${i + 1}: unidentified`);
            }
          }

          // send tracklist back to client
          res.status(200).send(results);

        }).then(() => {
          fs.rmdirSync(dirname);  // delete temporary directory
          fs.unlinkSync(input);   // delete received file
        })
      })
    })
  });

  YD.on("error", function (error) {
    console.log(error);
  });

  YD.on("progress", function (progress) {
    console.log(JSON.stringify(progress));
  });
}

function identifySegment (source, start, end, output) {
  return new Promise((resolve, reject) => {
    source.then(function (audio) {                      // ffmpeg promise from source file
      audio.addCommand('-ss', `${start}`);              // start time of segment
      audio.addCommand('-to', `${end}`);                // end time of segment

      audio.save(`${output}`).then(() => {              // save segment to file
        console.log(`Saved segment to file: ${output}`);
        return requestMetadata(output);                 // get metadata from API
      }).then((trackMetadata) => {
        console.log(`Received identification response for ${output}`);
        fs.unlink(`${output}`, () => true);             // delete segment file
        resolve(trackMetadata);                         // resolve promise with metadata
      });
    })
  })
}

module.exports = { downloadYouTube };

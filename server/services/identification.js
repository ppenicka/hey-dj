const ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');
const requestMetadata = require('./AcrCloudClient');


function getTracklist (req, res) {
  req.files.file.mv(`./tmp/${req.files.file.name}`).then(() => {




  let input = `./tmp/${req.files.file.name}`;
  console.log('input', input);

  let interval = 240;
  let length = 0;
  let segments = 0;
  const results = [];

  const dirname = './tmp/' + path.basename(input);
  console.log('dirname', dirname)
  fs.mkdir(dirname, () => true);
  const source = new ffmpeg(`${input}`);

  source
    .then((audio) => {
      length = audio.metadata.duration['seconds'];
      segments = Math.floor((length - 60) / interval);

      // identify segments
      for (let i = 0; i < segments; i++) {
        results[i] = identifySegment(source, 60 + i * interval, 72 + i * interval, `./tmp/${name}/${i}.mp3`);
      }

      Promise.all(results).then((results) => {

        // second try for unidentified
        for (let i = 0; i < segments; i++) {
          if (results[i].status.msg === 'No result') {
            results[i] = identifySegment(source, 60 + i * interval + Math.floor(interval / 2), 72 + i * interval + Math.floor(interval / 2), `./tmp/${name}/${i}.mp3`);
          }
        }

        Promise.all(results).then((results) => {
          // merge duplicate results
          let i = 0;
          while (i < segments - 1) {
            if ((results[i].status.msg !== 'Success') && (results[i+1].status.msg !== 'Success') ||
                ((results[i].status.msg === 'Success') && (results[i+1].status.msg === 'Success') &&
                (results[i].metadata.music[0].title === results[i + 1].metadata.music[0].title) &&
                (results[i].metadata.music[0].duration === results[i + 1].metadata.music[0].duration))) {
              results.splice(i + 1, 1);
              segments--;
            } else i++;
          }

          console.log('######## Identified tracklist: ########');
          for (let i = 0; i < segments; i++) {
            if (results[i].status.msg === 'Success') {
              console.log(`Track #${i + 1}: ${results[i].metadata.music[0].artists[0].name} - ${results[i].metadata.music[0].title}`);
            } else {
              console.log(`Track #${i + 1}: unidentified`);
            }
          }

          // send tracklist back to client
          res.status(200).send(results);
        }).then(() => {
          fs.rmdir(`./tmp/${name}`, () => true);  // delete temporary directory
        })

      })
    })



  })
}

function identifySegment (source, start, end, output) {
  return new Promise((resolve, reject) => {
    source                                                // ffmpeg promise from source file
      .then(function (audio) {
        audio.addCommand('-ss', `${start}`);              // start time of segment
        audio.addCommand('-to', `${end}`);                // end time of segment
        audio.save(`${output}`)                           // save segment to file
          .then(() => {
            console.log(`Saved segment to file: ${output}`);
            return requestMetadata(output);               // get metadata from API
          })
          .then((trackMetadata) => {
            console.log(`Received identification response for ${output}`);
            fs.unlink(`${output}`, () => true);           // delete segment file
            console.log(trackMetadata);
            resolve(trackMetadata);                       // resolve promise with metadata
          });
      })
  })
}

module.exports = {getTracklist};

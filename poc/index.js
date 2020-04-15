const ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');
const requestMetadata = require('./acrclient');

function getTracklist (input, interval) {
  let length = 0;
  let segments = 0;
  const results = [];

  const name = path.basename(input);
  fs.mkdir(`./tmp/${name}`, () => true);
  const source = new ffmpeg(`${input}`);

  source
    .then((audio) => {
      length = audio.metadata.duration['seconds'];
      segments = Math.floor((length - 60) / interval);

      console.log('Length of the set is:', length);
      console.log(`Number of ${interval}-second segments:`, segments);

      // identify segments
      for (let i = 0; i < segments; i++) {
        results[i] = identifySegment(source, 60 + i * interval, 72 + i * interval, `./tmp/${name}/${i}.mp3`, i);
      }

      Promise.all(results).then((results) => {
        console.log('ALL results', results);

        // second try for unidentified
        for (let i = 0; i < segments; i++) {
          if (results[i].status.msg === 'No result') {
            results[i] = identifySegment(source, 60 + i * interval + Math.floor(interval / 2), 72 + i * interval + Math.floor(interval / 2), `./tmp/${name}/${i}.mp3`, i);
          }
        }

        Promise.all(results).then((results) => {
          // merge duplicate results
          let i = 0;
          while (i < segments - 1) {
            if ((results[i].status.msg === 'No result') && (results[i+1].status.msg === 'No result') ||
                ((results[i].status.msg === 'Success') && (results[i+1].status.msg === 'Success') &&
                (results[i].metadata.music[0].title === results[i + 1].metadata.music[0].title) &&
                (results[i].metadata.music[0].duration === results[i + 1].metadata.music[0].duration))) {
              results.splice(i + 1, 1);
              segments--;
            } else i++;
          }

          for (let i = 0; i < segments; i++) {
            if (results[i].status.msg === 'Success') {
              console.log(`Track #${i + 1}: ${results[i].metadata.music[0].artists[0].name} - ${results[i].metadata.music[0].title} - ${results[i].metadata.music[0].acrid}`);
            } else {
              console.log(`Track #${i + 1}: unidentified`);
            }
          }

        }).then(() => {
          fs.rmdir(`./tmp/${name}`, () => true);
        })

      })
    })
}

function identifySegment (source, start, end, output, segmentId) {
  return new Promise((resolve, reject) => {
    source                                                // ffmpeg promise from source file
      .then(function (audio) {
        audio.addCommand('-ss', `${start}`);              // start time of segment
        audio.addCommand('-to', `${end}`);                // end time of segment
        audio.save(`${output}`)                           // save segment to file
          .then(() => {
            return requestMetadata(output, segmentId);    // get metadata from API
          })
          .then((trackMetadata) => {
            fs.unlink(`${output}`, () => true);           // delete segment file
            resolve(trackMetadata);                       // resolve promise with metadata
          });
      })
  })
}


getTracklist('./set.mp3', 440);

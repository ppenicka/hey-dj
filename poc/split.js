const ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');
const identifySegment = require('./identify');

function cutSegment (source, start, end, output, segmentId) {
  try {
    source.then(function (audio) {
      audio.addCommand('-ss', `${start}`);
      audio.addCommand('-to', `${end}`);
      audio.save(`${output}`, (err, files) => {
        if (err) console.log('Error: ', err);
        else console.log(`Audio segment ${segmentId} extracted and saved to `, files);
      });
    }, function (err) {
      console.log('Error: ', err);
    });
  } catch (err) {
    console.log('Error:', err);
  }
}

function getTracklist (input, interval) {
  const source = new ffmpeg(`${input}`);
  let length = 0;
  let segments = 0;
  let results = [];

  source.then((audio) => {
    length = audio.metadata.duration['seconds'];
    segments = Math.floor((length - 60) / interval);

    console.log('Length of the set is:', length);
    console.log(`Number of ${interval}-second segments:`, segments);

    // extract segment files
    for (let i = 0; i < segments; i++) {
      cutSegment(source, 60 + i * interval, 72 + i * interval, `./tmp/set-${i}.mp3`, i);
    }
  }).then(() => {
    setTimeout(() => {
      for (let i = 0; i < segments; i++) {
        setTimeout(() => {
          console.log(`Requesting identification of segment ${i}`);
          identifySegment(`./tmp/set-${i}.mp3`, i, results);
        }, (i + 1) * 1000);
      }
    }, 80000);
  }).finally(() => {
    setTimeout(() => {
      // merge duplicates
      let i = 0;
      while (i < segments - 1) {
        if ((!results[i].metadata && !results[i+1].metadata) ||
            (results[i].metadata && results[i + 1].metadata) &&
            (results[i].metadata.music[0].title === results[i + 1].metadata.music[0].title)) {
          results.splice(i + 1, 1);
          segments--;
        } else i++;
      }

      // console log tracklist
      for (let i = 0; i < segments; i++) {
        if (results[i].metadata) {
          console.log(`Track #${i + 1}: ${results[i].metadata.music[0].artists[0].name} - ${results[i].metadata.music[0].title}`);
        } else {
          console.log(`Track #${i + 1}: unidentified`);
        }
      }

      // delete segment files
      fs.readdir('./tmp', (err, files) => {
        if (err) console.log(err);
        else {
          for (let file of files) {
            fs.unlink(path.join('./tmp', file), () => true);
          }
        }

      })

    }, 120000);
  });
}

getTracklist('./set.mp3', 240);

const ffmpeg = require('ffmpeg');
const fs = require('fs');
const identifySegment = require('./identify');

function cutSegment (source, start, end, output, segmentId) {
  try {
    source.then(function (audio) {
      audio.addCommand('-ss', `${start}`);
      audio.addCommand('-to', `${end}`);
      audio.save(`${output}`, (err, files) => {
        if (err) {
          console.log('Error: ', err);
        } else {
          console.log(`Audio segment ${segmentId} extracted and saved to `, files);
        }
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

    for (let i = 0; i < segments; i++) {
      cutSegment(source, 60 + i * interval, 72 + i * interval, `./set-${i}.mp3`, i);
    }
  }).then(() => {
    setTimeout(() => {
      for (let i = 0; i < segments; i++) {
        setTimeout(() => {
          console.log(`Requesting identification of segment ${i}`);
          identifySegment(`./set-${i}.mp3`, i, results);
        }, (i + 1) * 1000);
      }
    }, 80000);
  }).finally(() => {
    setTimeout(() => {

      for (let i = 0; i < segments; i++) {
        if (results[i].metadata) {
          console.log(`Track #${i + 1}: ${results[i].metadata.music[0].artists[0].name} - ${results[i].metadata.music[0].title}`);
        } else {
          console.log(`Track #${i + 1}: unidentified`);
        }
      }

      console.log('Number of tracks before merging duplicates:', results.length, segments);

      let i = 0;
      while (i < segments - 1) {
        if ((results[i].metadata && results[i + 1].metadata) && (results[i].metadata.music[0].title === results[i + 1].metadata.music[0].title)) {
          results.splice(i + 1, 1);
          segments--;
        } else if (!results[i].metadata && !results[i+1].metadata) {
          results.splice(i + 1, 1);
          segments--;
        } else {
          i++;
        }
      }

      console.log('Number of tracks after merging duplicates:', results.length, segments);


      for (let i = 0; i < segments; i++) {
        if (results[i].metadata) {
          console.log(`Track #${i + 1}: ${results[i].metadata.music[0].artists[0].name} - ${results[i].metadata.music[0].title}`);
        } else {
          console.log(`Track #${i + 1}: unidentified`);
        }
      }
    }, 120000);
  });
}

getTracklist('./set.mp3', 240);

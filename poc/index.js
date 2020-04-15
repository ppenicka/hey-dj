const ffmpeg = require('ffmpeg');
const fs = require('fs');
const path = require('path');
const identifySegment = require('./acrclient');

function getTracklist (input, interval) {
  let length = 0;
  let segments = 0;
  const results = [];

  const name = path.basename(input);
  fs.mkdir(`./tmp/${name}`, () => true);
  const source = new ffmpeg(`${input}`);

  source.then((audio) => {
    length = audio.metadata.duration['seconds'];
    segments = Math.floor((length - 60) / interval);

    console.log('Length of the set is:', length);
    console.log(`Number of ${interval}-second segments:`, segments);

    for (let i = 0; i < segments; i++) {
      results[i] = cutSegment(results, source, 60 + i * interval, 72 + i * interval, `./tmp/${name}/${i}.mp3`, i);
    }


    Promise.all(results).then((results) => {
      console.log('ALL results', results);

      for (let i = 0; i < segments; i++) {
        if (results[i].metadata) {
          console.log(`Track #${i + 1}: ${results[i].metadata.music[0].artists[0].name} - ${results[i].metadata.music[0].title}`);
        } else {
          console.log(`Track #${i + 1}: unidentified`);
        }
      }
    })


  })

}

function cutSegment (results, source, start, end, output, segmentId) {
  return new Promise((resolve, reject) => {
    source
      .then(function (audio) {
        audio.addCommand('-ss', `${start}`);
        audio.addCommand('-to', `${end}`);
        audio.save(`${output}`)
          .then(() => {
            return identifySegment(output, segmentId);
          })
          .then((pr) => {
            resolve(pr);
          });
      })
  })
}


getTracklist('./set.mp3', 240);

const ffmpeg = require('ffmpeg');
const fs = require('fs');
const identifySegment = require('./identify-segment');

function getTracklist (input, dirname, extension, interval) {
  return new Promise((resolve, reject) => {
    const results = [];
    const times = [];
    fs.mkdirSync(dirname);
    const source = new ffmpeg(input);
    source.then((audio) => {
      const length = audio.metadata.duration['seconds'];
      let segments = Math.floor((length - 60) / interval);

      // identify segments
      for (let i = 0; i < segments; i++) {
        const startTime = 60 + i * interval;
        results[i] = identifySegment(source, startTime, startTime + 12, `${dirname}/${i}.${extension}`);
        times[i] = startTime;
      }

      // second try for unidentified
      Promise.all(results).then((results) => {
        for (let i = 0; i < segments; i++) {
          if (results[i].status.code === 1001) {
            const startTime = 60 + i * interval + Math.floor(interval / 2);
            results[i] = identifySegment(source, startTime, startTime + 12, `${dirname}/${i}.${extension}`);
            times[i] = startTime;
          }
        }

        Promise.all(results).then((results) => {
          // build Map from times and results
          let map = {};
          for (let i = 0; i < segments; i++) {
            map[times[i]] = results[i];
          }




          // // merge duplicate results
          // Promise.all(results).then((results) => {
          //   let i = 0;
          //   while (i < segments - 1) {
          //     if ((results[i].status.code !== 0) && (results[i + 1].status.code !== 0) ||
          //       ((results[i].status.code === 0) && (results[i + 1].status.code === 0) &&
          //         (results[i].metadata.music[0].title === results[i + 1].metadata.music[0].title) &&
          //         (results[i].metadata.music[0].duration === results[i + 1].metadata.music[0].duration))) {
          //       results.splice(i + 1, 1);
          //       segments--;
          //     } else i++;
          //   }

          console.log('######## Identified tracklist: ########'); // eslint-disable-line no-console
          for (let time in map) {
            if (map[time].status.code === 0) {
              console.log(`${time}: ${map[time].metadata.music[0].artists[0].name} - ${map[time].metadata.music[0].title}`);  // eslint-disable-line no-console
            } else {
              console.log(`${time}: unidentified`); // eslint-disable-line no-console
            }
          }

          // return tracklist with times
          resolve(map);

        }).then(() => {
          fs.rmdirSync(dirname);  // delete temporary directory
          fs.unlinkSync(input);   // delete received file
        });
      });
    });
  });
}

module.exports = getTracklist;

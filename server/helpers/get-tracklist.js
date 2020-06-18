const ffmpeg = require('ffmpeg');
const fs = require('fs');
const identifySegment = require('./identify-segment');

function getTracklist (input, dirname, extension, interval) {
  return new Promise((resolve, reject) => {
    try {
      const results = [];
      fs.mkdirSync(dirname);
      const source = new ffmpeg(input);
      source.then((audio) => {
        const length = audio.metadata.duration['seconds'];
        let segments = Math.floor((length - 60) / interval);

        // identify segments
        for (let i = 0; i < segments; i++) {
          const start = 60 + i * interval;
          results[i] = identifySegment(source, start, start + 12, `${dirname}/${i}.${extension}`);
        }

        // second try for unidentified
        Promise.all(results).then((results) => {
          for (let i = 0; i < segments; i++) {
            if (results[i].status.code === 1001) {
              const start = 60 + i * interval + Math.floor(interval / 2);
              results[i] = identifySegment(source, start, start + 12, `${dirname}/${i}.${extension}`);
            }
          }

          // merge duplicate results
          Promise.all(results).then((results) => {
            let i = 0;
            while (i < segments - 1) {
              if (nextIsDuplicate(results, i)) {
                results.splice(i + 1, 1);
                segments--;
              } else i++;
            }

            console.log('######## Identified tracklist: ########'); // eslint-disable-line no-console
            for (let i = 0; i < segments; i++) {
              if (results[i].status.code === 0) {
                console.log(`Track #${i + 1}: ${results[i].metadata.music[0].artists[0].name} - ${results[i].metadata.music[0].title}`);  // eslint-disable-line no-console
              } else {
                console.log(`Track #${i + 1}: unidentified`); // eslint-disable-line no-console
              }
            }

            // send tracklist back to client
            resolve(results);

          }).then(() => {
            fs.rmdirSync(dirname);  // delete temporary directory
            fs.unlinkSync(input);   // delete received file
          });
        });
      });
    } catch (e) {
      reject(`Error while identifyting ${input}. Identifiction failed with error message: ${e}`);
    }
  });
}

function nextIsDuplicate (results, i) {
  return (results[i].status.code !== 0) && (results[i + 1].status.code !== 0) ||
    ((results[i].status.code === 0) && (results[i + 1].status.code === 0) &&
      (results[i].metadata.music[0].title === results[i + 1].metadata.music[0].title) &&
      (results[i].metadata.music[0].duration === results[i + 1].metadata.music[0].duration))
    ? true : false;
}

module.exports = getTracklist;

const requestMetadata = require('../services/acrcloud-client');
const fs = require('fs');

function identifySegment (source, start, end, output) {
  return new Promise((resolve, reject) => {
    source.then(function (audio) {                        // ffmpeg promise from source file
      audio.addCommand('-ss', `${start}`);                // start time of segment
      audio.addCommand('-to', `${end}`);                  // end time of segment

      audio.save(`${output}`).then(() => {                // save segment to file
        console.log(`Saved segment to file: ${output}`);                // eslint-disable-line no-console
        return requestMetadata(output);                   // get metadata from API
      }).then((trackMetadata) => {
        console.log(`Received identification response for ${output}`);  // eslint-disable-line no-console
        fs.unlink(`${output}`, () => true);               // delete segment file
        resolve(trackMetadata);                           // resolve promise with metadata
      });
    });
  });
}

module.exports = identifySegment;

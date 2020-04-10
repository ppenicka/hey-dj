const ffmpeg = require('ffmpeg');
const fs = require('fs');
const identifySegment = require('./identify');

function getSegment (input, start, end, output) {
  try {
    var source = new ffmpeg(`${input}`);
    source.then(function (audio) {
      console.log('The audio is ready to be processed');
      audio.addCommand('-ss', `${start}`);
      audio.addCommand('-to', `${end}`);
      audio.save(`${output}`, (err, files) => {
        if (err) {
          console.log('Error: ', err);
        } else {
          console.log('Saved to ', files);
        }
      });
    }, function (err) {
      console.log('Error: ', err);
    });
  } catch (err) {
    console.log('Error:', err);
  }
}

for (let i = 0; i < 11; i++) {
  getSegment('./set.mp3', 60 + i*180, 72 + i*180, `./set-${i}.mp3`);
}

for (let i = 0; i < 11; i++) {
  setTimeout(() => {
    console.log(`Calling segment ${i}`);
    identifySegment(`./set-${i}.mp3`)
  }, i*1000);
}
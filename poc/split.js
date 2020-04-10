const ffmpeg = require('ffmpeg');
const fs = require('fs');
const identifySegment = require('./identify');

function getSegment (source, start, end, output) {
  try {
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

function getSegments (input, interval) {
  const source = new ffmpeg(`${input}`);
  let length = 0;
  let segments = 0;

  source.then((audio) => {
    length = audio.metadata.duration['seconds'];
    return true;
  }).then(() => {
      setTimeout(() => {
        console.log('Length of the set is:', length);
      }, 1000);

      segments = Math.floor((length - 60) / interval);
      console.log(`Number of ${interval}-second segments:`, segments);

      for (let i = 0; i < segments; i++) {
        getSegment(source, 60 + i * interval, 72 + i * interval, `./set-${i}.mp3`);
      }

    }).then(() => {
    for (let i = 0; i < segments; i++) {
      setTimeout(async () => {
        console.log(`Requesting identification of segment ${i}`);
        identifySegment(`./set-${i}.mp3`);
      }, i*1000);
    }
  })

}

getSegments('./set.mp3', 500);

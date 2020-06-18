const shortid = require('shortid');
const getTracklist = require('../helpers/get-tracklist');
const TracklistFromFile = require('../models/tracklist-from-file');

function identifyFromFile (req, res) {
  const interval = process.env.SEGMENT_INTERVAL || 120;
  const name = req.files.file.name;
  const size = req.files.file.size;

  TracklistFromFile.find({ fileName: name, fileSize: size }).then((cached) => {
    if (cached.length > 0) {
      res.status(200).send(cached[0]['tracklist']);
    } else {
      const extension = name.substring(name.length - 3, name.length);
      const id = shortid.generate();
      const dirname = './tmp/' + id;
      const input = dirname + extension;

      req.files.file.mv(input).then(() => {
        getTracklist(input, dirname, extension, interval).then((results) => {
          TracklistFromFile.create({
            fileName: name,
            fileSize: size,
            tracklist: JSON.stringify(results)
          });
          res.status(200).send(results);
        });
      });
    }
  });
}

module.exports = { identifyFromFile };

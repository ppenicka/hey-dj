const shortid = require('shortid');
const { getTracklist } = require('./gettracklist');

function identifyFromFile (req, res) {
  const interval = 240;
  const name = req.files.file.name;
  const extension = name.substring(name.length - 3, name.length);
  const id = shortid.generate();
  const input = './tmp/' + id + '.' + extension;
  const dirname = input.substring(0, input.length - 4);

  req.files.file.mv(input)
    .then(() => {
      getTracklist(input, dirname, extension, interval).then((results) => {
        res.status(200).send(results);
      });
    });
}

module.exports = { identifyFromFile };

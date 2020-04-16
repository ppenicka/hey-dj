const express = require('express');
const cors = require('cors')();

const app = express();
const PORT = process.env.PORT || 3001;
const router = require('./router');

app
  .use(cors)
  .use(express.json())
  .use(router);

app.listen(PORT, (err) => {
  if (err) return console.log(err); // eslint-disable-line no-console
  console.log(`Server listening on port ${PORT}`); // eslint-disable-line no-console
});

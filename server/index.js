const express = require('express');
const cors = require('cors')();
const fileUpload = require('express-fileupload');
const app = express();
const PORT = process.env.PORT || 3001;
const router = require('./router');

app
  .use(cors)
  .use(express.json())
  .use(fileUpload())
  .use(function(req, res, next){
    res.setTimeout(600000, function(){
        console.log('Request timed out');
        res.status(500).send('Request timed out');
    });
    next();
})
  .use(router);

app.listen(PORT, (err) => {
  if (err) return console.log(err); // eslint-disable-line no-console
  console.log(`Server listening on port ${PORT}`); // eslint-disable-line no-console
});

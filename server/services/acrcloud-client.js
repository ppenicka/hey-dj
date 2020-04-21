const fs = require('fs');
const crypto = require('crypto');
const request = require('request');

const options = {
  host: process.env.HOST,
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type: 'audio',
  secure: true,
  access_key: process.env.ACCESS_KEY,
  access_secret: process.env.ACCESS_SECRET
};

function buildStringToSign (method, uri, accessKey, dataType, signatureVersion, timestamp) {
  return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
}

function sign (signString, accessSecret) {
  return crypto.createHmac('sha1', accessSecret)
    .update(Buffer.from(signString, 'utf-8'))
    .digest().toString('base64');
}

function requestMetadata (file) {
  const bitmap = fs.readFileSync(`${file}`);
  const data = Buffer.from(bitmap);
  const current_date = new Date();
  const timestamp = current_date.getTime() / 1000;

  const stringToSign = buildStringToSign('POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp);

  const signature = sign(stringToSign, options.access_secret);

  const formData = {
    sample: data,
    access_key: options.access_key,
    data_type: options.data_type,
    signature_version: options.signature_version,
    signature: signature,
    sample_bytes: data.length,
    timestamp: timestamp,
  };

  return new Promise((resolve, reject) => {
    request.post({
      url: 'http://' + options.host + options.endpoint,
      method: 'POST',
      formData: formData
    }, function (err, httpResponse, body) {
      if (err) reject(err);
      resolve(JSON.parse(body));
    });
  });
}

module.exports = requestMetadata;

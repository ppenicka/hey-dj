const fs = require('fs');
const crypto = require('crypto');
const request = require('request');

// Replace "###...###" below with your project's host, access_key and access_secret.
const defaultOptions = {
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

/**
 * Identifies a sample of bytes
 */
function identify (data, options, cb) {

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
  request.post({
    url: 'http://' + options.host + options.endpoint,
    method: 'POST',
    formData: formData
  }, cb);
}

function identifySegment (file) {
  return new Promise((resolve, reject) => {
    var bitmap = fs.readFileSync(`${file}`);
    identify(Buffer.from(bitmap), defaultOptions, function (err, httpResponse, body) {
      if (err) reject(err);
      resolve(JSON.parse(body));
    });
  });
}

module.exports = identifySegment;
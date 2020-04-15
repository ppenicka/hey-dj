const fs = require('fs');
const crypto = require('crypto');
const request = require('request');

// Replace "###...###" below with your project's host, access_key and access_secret.
var defaultOptions = {
  host: 'identify-eu-west-1.acrcloud.com',
  endpoint: '/v1/identify',
  signature_version: '1',
  data_type: 'audio',
  secure: true,
  access_key: '3a0f85361d6eb3a4528ea83f02f6a645',
  access_secret: 's3pTyXYaQnPvpUpzNc44hrGymHrjMkcvrXV3k60F'
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

  var current_data = new Date();
  var timestamp = current_data.getTime() / 1000;

  var stringToSign = buildStringToSign('POST',
    options.endpoint,
    options.access_key,
    options.data_type,
    options.signature_version,
    timestamp);

  var signature = sign(stringToSign, options.access_secret);

  var formData = {
    sample: data,
    access_key: options.access_key,
    data_type: options.data_type,
    signature_version: options.signature_version,
    signature: signature,
    sample_bytes: data.length,
    timestamp: timestamp,
  }
  request.post({
    url: "http://" + options.host + options.endpoint,
    method: 'POST',
    formData: formData
  }, cb);
}

function identifySegment (file, segmentId) {
  return new Promise((resolve, reject) => {
    var bitmap = fs.readFileSync(`${file}`);
    identify(Buffer.from(bitmap), defaultOptions, function (err, httpResponse, body) {
      if (err) console.log(err);
      console.log('Identified segment ', segmentId);
      console.log(body);

      resolve(JSON.parse(body));
  })
  });
}

module.exports = identifySegment;
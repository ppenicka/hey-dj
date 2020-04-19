const baseUrl = 'http://localhost:3001';

export const getTracklistFromYouTube = (url) =>
  fetch(baseUrl + '/yt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ytUrl: url})
  })
    .then(res => res.json())

export const getTracklistFromFile = (data) =>
  fetch(baseUrl + '/tracklist', {
    method: 'POST',
    body: data
  }).then(res => res.json())
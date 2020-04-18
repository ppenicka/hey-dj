const baseUrl = 'http://localhost:3001';

export const getTracklist = () =>
  fetch(baseUrl + '/tracklist')
    .then(res => res.json())

export const getTracklistFromFile = (data) =>
  fetch(baseUrl + '/tracklist', {
    method: 'POST',
    body: data
  }).then(res => res.json())
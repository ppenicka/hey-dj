const baseUrl = 'http://localhost:3001';

export const getTracklist = () =>
  fetch(baseUrl + '/tracklist')
    .then(res => res.json())

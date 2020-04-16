import React from 'react';
import './TrackTile.css';

export default (props) => (
  <div className="TrackTile">
    {
      (props.track.status) ? (
      (props.track.status.msg === 'Success') ?
      (props.track.metadata.music[0].artists[0].name + ' - ' +  props.track.metadata.music[0].title) :
      'unidentified') :
      'no data yet'
    }
  </div>
);

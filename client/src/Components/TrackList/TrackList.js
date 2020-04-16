import React from 'react';
import './TrackList.css';
import '../TrackTile/TrackTile';
import TrackTile from '../TrackTile/TrackTile';

export default (props) => (
  <div>
    {props.tracklist.map(track => <TrackTile track={track}></TrackTile>)
    }

  </div>
);

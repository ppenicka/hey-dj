import React from 'react';
import './TrackList.css';
import '../TrackTile/TrackTile';
import TrackTile from '../TrackTile/TrackTile';

export default (props) => (
  <ul>
    {props.tracklist.map(track => <TrackTile track={track}></TrackTile>)}
    <button className="Button" onClick={props.back}>&lt; back</button>
  </ul>
);

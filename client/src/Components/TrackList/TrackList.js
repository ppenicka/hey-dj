import React from 'react';
import './TrackList.css';
import '../TrackTile/TrackTile';
import TrackTile from '../TrackTile/TrackTile';

export default (props) => (
  <ul>
    {Object.keys(props.tracklist).map(key => <TrackTile track={props.tracklist[key]} time={key}></TrackTile>)}
    <button className="Button" onClick={props.back}>&lt; back</button>
  </ul>
);

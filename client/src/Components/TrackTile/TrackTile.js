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
    {
      (props.track.metadata && props.track.metadata.music[0].external_metadata.musicbrainz) ?
      <img className="Logo" src={`${process.env.PUBLIC_URL}/musicbrainz_monochrome_hexagon.png`} alt="Info on MusicBrainz"></img>
        : <img className="LogoHidden" src={`${process.env.PUBLIC_URL}/musicbrainz_monochrome_hexagon.png`} alt="Info on MusicBrainz"></img>
    }
    {
      (props.track.metadata && props.track.metadata.music[0].external_metadata.deezer) ?
      <img className="Logo" src={`${process.env.PUBLIC_URL}/deezer_round_monochrome.png`} alt="Listen on Deezer"></img>
        : <img className="LogoHidden" src={`${process.env.PUBLIC_URL}/deezer_round_monochrome.png`} alt="Listen on Deezer"></img>
    }
    {
      (props.track.metadata && props.track.metadata.music[0].external_metadata.youtube) ?
      <img className="Logo" src={`${process.env.PUBLIC_URL}/yt_round_monochrome.png`} alt="Listen on YouTube"></img>
        : <img className="LogoHidden" src={`${process.env.PUBLIC_URL}/yt_round_monochrome.png`} alt="Listen on YouTube"></img>
    }
    {
      (props.track.metadata && props.track.metadata.music[0].external_metadata.spotify) ?
      <img className="Logo" src={`${process.env.PUBLIC_URL}/Spotify_Icon_RGB_Black.png`} alt="Listen on Spotify"></img>
        : <img className="LogoHidden" src={`${process.env.PUBLIC_URL}/Spotify_Icon_RGB_Black.png`} alt="Listen on Spotify"></img>
    }
  </div>
);

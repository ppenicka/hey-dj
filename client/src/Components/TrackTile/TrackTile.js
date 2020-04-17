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
      <a href={`https://musicbrainz.org/recording/${props.track.metadata.music[0].external_metadata.musicbrainz[0].track.id}`} target="_blank"><img className="Logo" src={`${process.env.PUBLIC_URL}/musicbrainz_monochrome_hexagon.png`} alt="Info on MusicBrainz"></img></a>
        : <img className="LogoHidden" src={`${process.env.PUBLIC_URL}/musicbrainz_monochrome_hexagon.png`} alt="Info on MusicBrainz"></img>
    }
    {
      (props.track.metadata && props.track.metadata.music[0].external_metadata.deezer) ?
      <a href={`https://deezer.com/track/${props.track.metadata.music[0].external_metadata.deezer.track.id}`} target="_blank"><img className="Logo" src={`${process.env.PUBLIC_URL}/deezer_round_monochrome.png`} alt="Listen on Deezer"></img></a>
        : <img className="LogoHidden" src={`${process.env.PUBLIC_URL}/deezer_round_monochrome.png`} alt="Listen on Deezer"></img>
    }
    {
      (props.track.metadata && props.track.metadata.music[0].external_metadata.youtube) ?
      <a href={`https://www.youtube.com/watch?v=${props.track.metadata.music[0].external_metadata.youtube.vid}`} target="_blank"><img className="Logo" src={`${process.env.PUBLIC_URL}/yt_round_monochrome.png`} alt="Listen on YouTube"></img></a>
        : <img className="LogoHidden" src={`${process.env.PUBLIC_URL}/yt_round_monochrome.png`} alt="Listen on YouTube"></img>
    }
    {
      (props.track.metadata && props.track.metadata.music[0].external_metadata.spotify) ?
      <a href={`http://open.spotify.com/track/${props.track.metadata.music[0].external_metadata.spotify.track.id}`} target="_blank"><img className="Logo" src={`${process.env.PUBLIC_URL}/Spotify_Icon_RGB_Black.png`} alt="Listen on Spotify"></img></a>
        : <img className="LogoHidden" src={`${process.env.PUBLIC_URL}/Spotify_Icon_RGB_Black.png`} alt="Listen on Spotify"></img>
    }
  </div>
);

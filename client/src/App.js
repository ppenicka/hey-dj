import React, { useState } from 'react';
import './App.css';
import './Components/InputForm/InputForm';
import InputForm from './Components/InputForm/InputForm';
import TrackList from './Components/TrackList/TrackList';
import Spinner from './Components/Spinner/Spinner';
import { getTracklistFromFile, getTracklistFromYouTube } from './Services/ApiClient';

function App () {
  const [tracklist, setTracklist] = useState([]);
  const [initial, setInitial] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [url, setUrl] = useState('');

  function onClick () {
    setInitial(false);
    setSpinning(true);

    if (url.length > 0) {
      getTracklistFromYouTube(url).then((data) => {
        setTracklist(data);
        setSpinning(false);
      });
    } else {
      const formData = new FormData();
      formData.append('file', selectedFile);
      getTracklistFromFile(formData).then((data) => {
        console.log(data);
        setTracklist(data);
        setSpinning(false);
      });
    }
  }

  function back () {
    setInitial(true);
    setSpinning(false);
    setSelectedFile(null);
    setUrl('');
    setTracklist([]);
  }

  return (
    <div className="App">
      {
        initial ? <InputForm onClick={onClick} setSelectedFile={setSelectedFile} setUrl={setUrl}></InputForm> :
          spinning ? <Spinner></Spinner> : <TrackList tracklist={tracklist} back={back}></TrackList>
      }
    </div>
  );
}

export default App;

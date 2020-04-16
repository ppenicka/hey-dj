import React, {useState, useEffect} from 'react';
import './App.css';
import './Components/InputForm/InputForm';
import InputForm from './Components/InputForm/InputForm';
import TrackList from './Components/TrackList/TrackList';
import { getTracklist } from './Services/ApiClient';


function App() {
  const [tracklist, setTracklist] = useState(['no data yet']);

  function click () {
    getTracklist().then((data) => {
      console.log(data);

      setTracklist(data);
    })
  }

  return (
    <div className="App">
      <InputForm click={click}></InputForm>
      <TrackList tracklist={tracklist}></TrackList>
    </div>
  );
}

export default App;

import React, {useState, useEffect} from 'react';
import './App.css';
import './Components/InputForm/InputForm';
import InputForm from './Components/InputForm/InputForm';
import TrackList from './Components/TrackList/TrackList';
import { getTracklist } from './Services/ApiClient';

import { FakeResponse } from './fake-response';


function App() {
  const [tracklist, setTracklist] = useState([]);

  function click () {
    setTracklist(FakeResponse);
    // getTracklist().then((data) => {
    //   console.log(data);
      // setTracklist(data);
    // })
  }

  return (
    <div className="App">
      <InputForm click={click}></InputForm>
      <TrackList tracklist={tracklist}></TrackList>
    </div>
  );
}

export default App;

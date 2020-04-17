import React, {useState, useEffect} from 'react';
import './App.css';
import './Components/InputForm/InputForm';
import InputForm from './Components/InputForm/InputForm';
import TrackList from './Components/TrackList/TrackList';
import { getTracklist } from './Services/ApiClient';

import { FakeResponse } from './fake-response';


function App() {
  const [tracklist, setTracklist] = useState([]);
  const [ initial, setInitial ] = useState(true);
  const [ spinning, setSpinning ] = useState(false);

  function click () {

    setInitial(false);
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setTracklist(FakeResponse);
    }, 5000);
    // getTracklist().then((data) => {
    //   console.log(data);
      // setTracklist(data);
    // })
  }

  function back() {
    setInitial(true);
    setSpinning(false);
    setTracklist([]);
  }

  return (
    <div className="App">
    {
      (initial) ? (<InputForm click={click}></InputForm>) :
      (spinning) ? (<img className="Spinner" src={`${process.env.PUBLIC_URL}/record_store.gif`}/>) :
      (<TrackList tracklist={tracklist} back={back}></TrackList>)
    }
    </div>
  );
}

export default App;

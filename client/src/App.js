import React from 'react';
import './App.css';
import './Components/InputForm/InputForm';
import InputForm from './Components/InputForm/InputForm';
import TrackList from './Components/TrackList/TrackList';

function App() {
  return (
    <div className="App">
      <InputForm></InputForm>
      <TrackList></TrackList>
    </div>
  );
}

export default App;

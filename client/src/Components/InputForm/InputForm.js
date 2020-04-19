import React, { useCallback, useState } from 'react';
import './InputForm.css';
import { useDropzone } from 'react-dropzone';

export default (props) => {
  const [dropZoneText, setDropZoneText] = useState('Drag & drop a recorded set, or click to select from filesystem');

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    props.setSelectedFile(file);
    setDropZoneText(file.name);
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  function handleUrlChange (event) {
    props.setUrl(event.target.value);
  }

  return (
    <div className="InputForm">
      <div>
        <input type="url" onChange={handleUrlChange}></input>
      </div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="Tile">
          <p>{dropZoneText}</p>
        </div>
      </div>
      <button className="Button" onClick={props.onClick}>Hey DJ, what's those songs?</button>
    </div>
  )
}

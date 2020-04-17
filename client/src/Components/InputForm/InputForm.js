import React, { useCallback, useState } from 'react';
import './InputForm.css';
import { useDropzone } from 'react-dropzone';

export default (props) => {
  const [dropZoneText, setDropZoneText] = useState('Drag & drop a recorded set, or click to select from filesystem');

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        setDropZoneText('Loaded');
      }
      reader.readAsArrayBuffer(file)
    })

  }, [])
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div className="InputForm">
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="Tile">
        <p>{dropZoneText}</p>
      </div>
      </div>
      <button className="RequestButton" onClick={props.click}>Hey DJ, what's those songs?</button>
      </div>
  )
}

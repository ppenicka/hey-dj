import React from 'react';
import './Spinner.css';

export default (props) => (
  <img className="Spinner" src={`${process.env.PUBLIC_URL}/record_store.gif`} alt="Searching records collection"/>
);

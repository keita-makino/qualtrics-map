import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const mapRender = (apiKey: string) => {
  ReactDOM.render(
    <App apiKey={apiKey} />,
    document.getElementById('Questions')
  );
};

(window as any).mapRender = mapRender;

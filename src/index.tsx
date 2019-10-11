import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';

const mapRender = (apiKey: string, returnType: string) => {
  const container = document.createElement('div');
  container.setAttribute('id', 'MapContainer');

  document.getElementsByClassName('ChoiceStructure')[0].appendChild(container);

  const numPins = document
    .getElementsByClassName('ChoiceStructure')[0]
    .getElementsByTagName('input').length;

  ReactDOM.render(
    <>
      <Map apiKey={apiKey} numPins={numPins} returnType={returnType} />
    </>,
    document.getElementById('MapContainer')
  );
};

(window as any).mapRender = mapRender;

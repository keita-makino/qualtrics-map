import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map';

const mapRender = (apiKey: string, returnType: string) => {
  const container = document.createElement('div');
  container.setAttribute('id', 'MapContainer');

  document.getElementsByClassName('ChoiceStructure')[0].appendChild(container);

  const directionContainer = document.getElementsByClassName(
    'ChoiceStructure'
  )[0];

  const labelArray = directionContainer.getElementsByTagName('label');

  ReactDOM.render(
    <>
      <Map
        apiKey={apiKey}
        numPins={labelArray.length}
        returnType={returnType}
        labels={[...labelArray].map(item => {
          return item.children[0].textContent
            ? item.children[0].textContent
            : '';
        })}
      />
    </>,
    document.getElementById('MapContainer')
  );
  (directionContainer.children[0] as HTMLElement).style.display = 'none';
};

(window as any).mapRender = mapRender;

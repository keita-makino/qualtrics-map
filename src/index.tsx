import React from 'react';
import { render } from 'react-dom';
import Map from './components/Map';

const mapRender = (
  apiKey: string,
  target: HTMLElement,
  center?: { lat: number; lng: number }
) => {
  const container = document.createElement('div');
  container.setAttribute('id', `MapContainer${target.id}`);

  target.getElementsByClassName('ChoiceStructure')[0].appendChild(container);

  const directionContainer = target.querySelectorAll(
    '[role*=presentation]'
  )[0] as HTMLElement;

  render(
    <>
      <Map
        apiKey={apiKey}
        directionContainer={directionContainer}
        defaultLocation={center}
      />
    </>,
    document.getElementById(`MapContainer${target.id}`)
  );
  directionContainer.style.display = 'none';
};

(window as any).mapRender = mapRender;

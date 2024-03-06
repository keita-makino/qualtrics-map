import React from 'react';
import { render } from 'react-dom';
import { Container } from './components';
import { Provider } from './store';

const mapRender = (
  accessToken: string,
  target: HTMLElement,
  defaultView?: {
    location: { lat: number; lng: number };
    zoom: number;
  },
) => {
  const container = document.createElement('div');
  container.setAttribute('id', `MapContainer${target.id}`);

  target.getElementsByClassName('ChoiceStructure')[0].appendChild(container);

  const directionContainer = target.querySelectorAll(
    '[role*=presentation]',
  )[0] as HTMLElement;

  render(
    <Provider>
      <Container
        accessToken={accessToken}
        directionContainer={directionContainer}
        view={defaultView}
      />
    </Provider>,
    document.getElementById(`MapContainer${target.id}`),
  );
  directionContainer.style.display = 'none';
};

(window as any).mapRender = mapRender;

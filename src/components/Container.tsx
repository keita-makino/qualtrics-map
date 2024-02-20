import React, { useState, useEffect, useReducer } from 'react';
import { Grid } from '@material-ui/core';
import { useLoadScript } from '@react-google-maps/api';
import { useGeocoder } from '../uses/useGeocoder';
import { ClearButton } from './ClearButton';
import { Map } from './Map';
import { View } from '../types/View';
import { useTrackedState, useUpdate } from '../store';
import { InputForm } from './InputForm';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import mapboxgl from 'mapbox-gl';

type Props = {
  apiKey: string;
  directionContainer: HTMLElement;
  view?: View;
};

export const Container: React.FC<Props> = (props) => {
  const isCenterProvided = props.view?.location !== undefined;
  const update = useUpdate();
  const state = useTrackedState();
  const getInitialLocation = () => {
    const region = (window as any).countryCode || 'US';
    const address = (window as any).postalCode
      ? `${region} ${(window as any).postalCode}`
      : region;
    return { address: address };
  };

  const inputHTMLElements =
    props.directionContainer.getElementsByTagName('input');
  const labelHTMLElements =
    props.directionContainer.getElementsByTagName('label');

  useEffect(() => {
    if ([...labelHTMLElements].length > 0) {
      update({
        type: 'ADD_INPUTS',
        inputs: [...labelHTMLElements].map((item, index) => ({
          label: item.children[0].textContent
            ? item.children[0].textContent
            : '',
          htmlElement: inputHTMLElements[index],
        })),
      });
      update({
        type: 'SET_ACCESS_TOKEN',
        accessToken: props.apiKey,
      });
    }
  }, []);

  return (
    <Grid container>
      <InputForm />
      <Map />
      <ClearButton />
    </Grid>
  );
};

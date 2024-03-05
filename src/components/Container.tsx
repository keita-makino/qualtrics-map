import React, { useState, useEffect, useReducer } from 'react';
import { Grid } from '@mui/material';
import { ClearButton } from './ClearButton';
import { Map } from './Map';
import { View } from '../types/View';
import { useTrackedState, useUpdate } from '../store';
import { InputForm } from './InputForm';
import mbxGeocoder from '@mapbox/mapbox-sdk/services/geocoding';
import { stat } from 'fs';

type Props = {
  accessToken: string;
  directionContainer: HTMLElement;
  view?: View;
};

export const Container: React.FC<Props> = (props) => {
  const state = useTrackedState();
  const update = useUpdate();
  const getInitialLocation = () => {
    const region = (window as any).countryCode || 'US';
    const address = (window as any).postalCode
      ? `${region} ${(window as any).postalCode}`
      : region;
    return address;
  };

  useEffect(() => {
    const geocoderService = mbxGeocoder({
      accessToken: props.accessToken,
    });

    geocoderService
      .forwardGeocode({
        query: getInitialLocation(),
      })
      .send()
      .then((response) => {
        console.log(response.body.features[0].center);

        if (response.body.features[0]) {
          update({
            type: 'MAP_MOVE',
            location: response.body.features[0].center
              ? {
                  lat: response.body.features[0].center[1],
                  lng: response.body.features[0].center[0],
                }
              : props.view?.location
                ? props.view.location
                : {
                    lat: 35,
                    lng: 0,
                  },
          });
        }
        update({
          type: 'SET_ACCESS_TOKEN',
          accessToken: props.accessToken,
        });
      });

    update({
      type: 'INITIALIZE_GEOCODER',
      geocoder: geocoderService,
    });

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
    }
    if (props.view?.zoom) {
      update({
        type: 'MAP_ZOOM',
        zoom: props.view.zoom,
      });
    }
  }, []);

  const inputHTMLElements =
    props.directionContainer.getElementsByTagName('input');
  const labelHTMLElements =
    props.directionContainer.getElementsByTagName('label');

  return (
    <Grid container>
      <InputForm />
      <Map />
      <ClearButton />
    </Grid>
  );
};
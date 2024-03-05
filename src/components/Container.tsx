import React, { useState, useEffect, useReducer } from 'react';
import { Grid } from '@mui/material';
import { ClearButton } from './ClearButton';
import { Map } from './Map';
import { View } from '../types/View';
import { useTrackedState, useUpdate } from '../store';
import { InputForm } from './InputForm';

type Props = {
  accessToken: string;
  directionContainer: HTMLElement;
  view?: View;
};

export const Container: React.FC<Props> = (props) => {
  const update = useUpdate();
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
        accessToken: props.accessToken,
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

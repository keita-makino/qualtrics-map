import { Grid, Box, makeStyles, TextField } from '@material-ui/core';
import { Autocomplete } from '@react-google-maps/api';
import React, { useEffect, useRef, useState } from 'react';
import { useTrackedState, useUpdate } from '../store';
import { AddressAutofill, SearchBox } from '@mapbox/search-js-react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export type InputRowProps = { label: string; index: number };

const useStyles = makeStyles({
  autocompleteContainer: {
    '& div': {
      width: '100%',
      '& input': {
        width: '100%',
      },
    },
    padding: '0.3rem 0 0.3rem 1rem',
    maxWidth: '75%',
  },
});

export const InputRow: React.FC<InputRowProps> = (props: InputRowProps) => {
  const classes = useStyles();
  const state = useTrackedState();
  const update = useUpdate();
  const [value, setValue] = useState('');

  const inputFormRowRef = useRef(null);

  useEffect(() => {
    if (inputFormRowRef.current && state.apiKey) {
      const geocoder = new MapboxGeocoder({
        accessToken: state.apiKey,
      });
      geocoder.on('result', (event) => {
        setValue(event.result.place_name);
        update({
          type: 'EDIT_INPUT',
          input: {
            label: props.label,
            address: event.result.place_name,
            location: {
              lat: event.result.center[1],
              lng: event.result.center[0],
            },
          },
          index: props.index,
        });
      });
      geocoder.addTo(inputFormRowRef.current);
      update({
        type: 'SET_GEOCODER',
        geocoder: geocoder,
        index: props.index,
      });
    }
  }, [inputFormRowRef, state.apiKey]);

  return (
    <Grid
      item
      container
      xl={12}
      lg={12}
      md={12}
      sm={12}
      xs={12}
      alignItems={'center'}
      justify={'space-between'}
    >
      {props.label}
      <Box flexGrow={1}>
        <div ref={inputFormRowRef} />
      </Box>
    </Grid>
  );
};

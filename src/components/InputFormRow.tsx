import { Grid, Box, makeStyles } from '@material-ui/core';
import { Autocomplete } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import { useTrackedState, useUpdate } from '../store';

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
  const [autocomplete, setAutocomplete] = useState<
    google.maps.places.Autocomplete | undefined
  >(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    setAddress(state.inputs[props.index].address);
  }, [state]);

  useEffect(() => {
    const inputIndexForLocationUpdate = state.inputs.findIndex(
      (item) => !item.location && item.address
    );

    if (inputIndexForLocationUpdate > -1 && state.geocoder) {
      const inputForLocationUpdate = state.inputs[inputIndexForLocationUpdate];
      state.geocoder.geocode(
        {
          address: inputForLocationUpdate.address,
        },
        (results, status) => {
          if (results) {
            update({
              type: 'EDIT_INPUT',
              input: {
                ...inputForLocationUpdate,
                location: results[0].geometry.location.toJSON(),
              },
              index: inputIndexForLocationUpdate,
            });
            update({
              type: 'SET_VIEW',
              view: {
                ...state.view,
                location: results[0].geometry.location.toJSON(),
              },
            });
          }
        }
      );
    }
  }, [state]);

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
      <Box flexGrow={1} className={classes.autocompleteContainer}>
        <Autocomplete
          onLoad={(autocomplete: google.maps.places.Autocomplete) => {
            setAutocomplete(autocomplete);
          }}
          onPlaceChanged={() => {
            if (autocomplete) {
              update({
                type: 'EDIT_INPUT',
                index: props.index,
                input: {
                  label: 'Edited address',
                  address: autocomplete.getPlace().formatted_address,
                },
              });
            }
          }}
        >
          <input
            type="text"
            placeholder="Search address or drop a pin on the map"
            value={address || ''}
            onChange={({ target: { value } }) => {
              setAddress(value);
            }}
          />
        </Autocomplete>
      </Box>
    </Grid>
  );
};

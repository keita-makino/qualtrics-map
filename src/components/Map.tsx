import { Grid, makeStyles } from '@material-ui/core';
import { GoogleMap, Marker as MapMarker } from '@react-google-maps/api';
import React, { useContext, useEffect } from 'react';
import { useTrackedState, useUpdate } from '../store';
import { Input } from '../types/Input';

const useStyles = makeStyles({
  button: {
    color: 'white !important',
  },
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
  mapContainer: {
    paddingTop: '2rem',
    '& [aria-label *= "Street View Pegman Control"]': {
      height: '30px !important',
    },
  },
});

export const Map: React.FC = () => {
  const classes = useStyles();
  const update = useUpdate();
  const state = useTrackedState();

  useEffect(() => {
    const inputIndexForAddressUpdate = state.inputs.findIndex(
      (item) => item.location && !item.address
    );

    if (inputIndexForAddressUpdate > -1 && state.geocoder) {
      const inputForAddressUpdate = state.inputs[inputIndexForAddressUpdate];
      state.geocoder.geocode(
        { location: inputForAddressUpdate.location },
        (results, status) => {
          if (results) {
            update({
              type: 'EDIT_INPUT',
              input: {
                ...inputForAddressUpdate,
                address: results[0].formatted_address,
              },
              index: inputIndexForAddressUpdate,
            });
          }
        }
      );
    }
  });

  return (
    <Grid
      item
      container
      xl={12}
      lg={12}
      md={12}
      sm={12}
      xs={12}
      className={classes.mapContainer}
    >
      <GoogleMap
        id="map"
        clickableIcons={false}
        mapContainerStyle={{
          width: '100%',
          height: '60vh',
        }}
        center={state.view.location}
        onClick={(event) => {
          const coordinates = {
            lat: event!.latLng!.lat(),
            lng: event!.latLng!.lng(),
          };
          update({
            type: 'EDIT_INPUT',
            input: { label: 'Clicked location', location: coordinates },
          });
        }}
        zoom={14}
      >
        {state.inputs.map((item: Input, index: number) => {
          if (item.location) {
            const label: google.maps.MarkerLabel | null =
              state.inputs[index].label !== ''
                ? {
                    text: state.inputs[index].label,
                    fontWeight: 'bold',
                  }
                : null;
            return (
              <MapMarker
                draggable={true}
                onDragEnd={(event: any) => {
                  const coordinates = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng(),
                  };
                  update({
                    type: 'EDIT_INPUT',
                    index: index,
                    input: { label: 'Clicked location', location: coordinates },
                  });
                }}
                label={label || undefined}
                position={item.location}
              />
            );
          } else {
            return null;
          }
        })}
      </GoogleMap>
    </Grid>
  );
};

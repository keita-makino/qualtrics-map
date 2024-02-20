import { Grid, makeStyles } from '@material-ui/core';
import { GoogleMap, Marker as MapMarker } from '@react-google-maps/api';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTrackedState, useUpdate } from '../store';
import { Input } from '../types/Input';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  'pk.eyJ1Ijoia2VtYWtpbm8iLCJhIjoiY2s1aHJibjRhMDZsNDNscDExM2w1NGJ1OCJ9.mc7KzAHPfIDbt6_ujYvNRw';

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
    height: '400px',
    width: '720px',
    '& [aria-label *= "Street View Pegman Control"]': {
      height: '30px !important',
    },
  },
});

export const Map: React.FC = () => {
  const classes = useStyles();
  const update = useUpdate();
  const state = useTrackedState();

  const mapContainer = useRef<any>(null);
  const [zoom, setZoom] = useState(9);

  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [state.view.location.lng, state.view.location.lat],
      zoom: zoom,
    });

    update({
      type: 'SET_MAP',
      map: newMap,
    });
    console.log('map initialized: ', newMap);
  }, []);

  useEffect(() => {
    if (markers.length === 0 && state.inputs.length > 0 && state.map) {
      setMarkers(
        state.inputs.map((input: Input) =>
          new mapboxgl.Marker().setLngLat([0, 90]).addTo(state.map!)
        )
      );
    }
  }, [state]);

  useEffect(() => {
    if (!state.map) return;
    state.map.on('click', (event: any) => {
      console.log(event.lngLat);
      state.map!.easeTo({
        center: [event.lngLat.lng, event.lngLat.lat],
        essential: true,
      });
      update({
        type: 'SET_VIEW',
        view: {
          ...state.view,
          location: {
            lat: event.lngLat.lat,
            lng: event.lngLat.lng,
          },
        },
      });
      update({
        type: 'EDIT_INPUT',
        input: {
          label: 'Clicked location',
          location: {
            lat: event.lngLat.lat,
            lng: event.lngLat.lng,
          },
        },
      });
    });
  }, [state.map]);

  useEffect(() => {
    console.log(markers);
    if (!state.map) return;
    if (markers.length === 0) return;
    console.log('replacing markers: ', state.view);
    state.inputs.forEach((input: Input, index: number) => {
      if (input.location !== undefined) {
        markers[index].setLngLat([input.location.lng, input.location.lat]);
      } else {
        markers[index].setLngLat([0, 90]);
      }
    });
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
      className={classes.mapContainer}
    >
      <div>
        {JSON.stringify(
          state.inputs.map((input: Input) => {
            input.label, input.address;
          })
        )}
        {JSON.stringify(state.view)}
        <div ref={mapContainer} className="map-container" />
      </div>
    </Grid>
  );
};

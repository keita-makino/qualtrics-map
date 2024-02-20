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

  const [markers, setMarkers] = useState<(mapboxgl.Marker | undefined)[]>([]);

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
    if (!state.map) return;
    console.log('setting map view: ', state.view);
    markers.map((marker) => marker?.remove());
    setMarkers(
      state.inputs.map((input: Input) => {
        return input.location !== undefined
          ? new mapboxgl.Marker().setLngLat([
              input.location!.lng,
              input.location!.lat,
            ])
          : undefined;
      })
    );
  }, [state]);

  useEffect(() => {
    console.log('markers: ', markers);
    if (state.inputs.every((item) => item.location === undefined)) {
      console.log('removing all markers');
      markers.map((marker) => marker?.remove());
    } else {
      markers
        .filter((item) => item !== undefined)
        .map((marker) => marker!.addTo(state.map!));
    }
  }, [markers]);

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

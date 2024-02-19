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
    width: '100%',
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
  const map = useRef<any>(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    });
    console.log(map.current);
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
      <div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </Grid>
  );
};

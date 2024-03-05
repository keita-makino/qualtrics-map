import { Grid, makeStyles } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Action, GlobalState, useTrackedState, useUpdate } from '../store';
import { Input } from '../types/Input';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import mbxGeocoder from '@mapbox/mapbox-sdk/services/geocoding';
import styled from '@emotion/styled';
import { useStandbyIndex } from '../uses/useStandbyIndex';

export const Map: React.FC = () => {
  const update = useUpdate();
  const state = useTrackedState();
  const index = useStandbyIndex();

  const mapContainer = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || !state.accessToken) return;
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [state.view.location.lng, state.view.location.lat],
      zoom: state.view.zoom,
      accessToken: state.accessToken,
    });

    newMap.on('click', (event: any) => {
      event.target.easeTo({
        center: [event.lngLat.lng, event.lngLat.lat],
        essential: true,
      });
      update({
        type: 'MAP_CLICK',
        location: {
          lat: event.lngLat.lat,
          lng: event.lngLat.lng,
        },
      });
    });

    update({
      type: 'INITIALIZE_MAP',
      map: newMap,
    });

    const geocoderService = mbxGeocoder({
      accessToken: state.accessToken,
    });

    update({
      type: 'INITIALIZE_GEOCODER',
      geocoder: geocoderService,
    });
  }, [mapContainer, state.accessToken]);

  useEffect(() => {
    if (state.markers.length === 0 && state.inputs.length > 0 && state.map) {
      update({
        type: 'ADD_MARKERS',
        markers: state.inputs.map(() =>
          new mapboxgl.Marker().setLngLat([0, 90]).addTo(state.map!),
        ),
      });
    }
  }, [state.markers, state.inputs, state.map]);

  return (
    <Grid item container xl={12} lg={12} md={12} sm={12} xs={12}>
      <div ref={mapContainer} style={{ height: '60vh', width: '100%' }} />
    </Grid>
  );
};

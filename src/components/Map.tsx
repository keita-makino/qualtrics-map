import { Grid, makeStyles } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Action, GlobalState, useTrackedState, useUpdate } from '../store';
import { Input } from '../types/Input';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import styled from '@emotion/styled';
import { useStandbyIndex } from '../uses/useStandbyIndex';

type Props = {
  accessToken: string;
};

export const Map: React.FC<Props> = (props: Props) => {
  const update = useUpdate();
  const state = useTrackedState();

  const mapContainer = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current || !props.accessToken) return;
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [state.view.location.lng, state.view.location.lat],
      zoom: state.view.zoom,
      accessToken: props.accessToken,
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

    newMap.on('dragend', (event: any) => {
      update({
        type: 'MAP_MOVE',
        location: {
          lat: event.target.getCenter().lat,
          lng: event.target.getCenter().lng,
        },
      });
    });

    newMap.on('zoomend', (event: any) => {
      update({
        type: 'MAP_ZOOM',
        zoom: event.target.getZoom(),
      });
    });

    update({
      type: 'INITIALIZE_MAP',
      map: newMap,
    });
  }, [mapContainer, props.accessToken]);

  useEffect(() => {
    if (state.markers.length === 0 && state.inputs.length > 0 && state.map) {
      update({
        type: 'ADD_MARKERS',
        markers: state.inputs.map((_item, index) =>
          new mapboxgl.Marker({
            draggable: true,
          })
            .on('dragstart', (event: any) => {
              update({
                type: 'RESET_CLICKED_INDEX',
              });
            })
            .on('dragend', (event: any) => {
              update({
                type: 'MOVE_MARKER_BY_DRAGGING',
                location: {
                  lat: event.target.getLngLat().lat,
                  lng: event.target.getLngLat().lng,
                },
                index: index,
              });
            })
            .setLngLat([0, 90])
            .addTo(state.map!),
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

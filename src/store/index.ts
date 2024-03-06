import { useReducer, useState } from 'react';
import { createContainer } from 'react-tracked';
import { Input } from '../types/Input';
import { View } from '../types/View';
import { Map, Marker } from 'mapbox-gl';
import { GeocodeService } from '@mapbox/mapbox-sdk/services/geocoding';
import { MapiRequest } from '@mapbox/mapbox-sdk/lib/classes/mapi-request';
import { reducer } from './reducer';

export type GlobalState = {
  inputs: Input[];
  map?: Map;
  view: View;
  markers: mapboxgl.Marker[];
  clickedIndex?: number;
  geocoder?: GeocodeService;
};

const initialState: GlobalState = {
  inputs: [],
  map: undefined,
  view: {
    location: { lat: 38.540604, lng: -121.766941 },
    zoom: 13.5,
  },
  markers: [],
  clickedIndex: undefined,
  geocoder: undefined,
};

export type Action =
  | {
      type: 'ADD_INPUTS';
      inputs: Input[];
    }
  | {
      type: 'EDIT_TEXTFIELD_VALUE';
      value: string | null;
      index: number;
    }
  | {
      type: 'EDIT_TEXTFIELD_INPUT_VALUE';
      value: string;
      index: number;
    }
  | {
      type: 'MAP_CLICK';
      location: { lat: number; lng: number };
    }
  | {
      type: 'MAP_MOVE';
      location: { lat: number; lng: number };
    }
  | {
      type: 'MAP_ZOOM';
      zoom: number;
    }
  | {
      type: 'INITIALIZE_MAP';
      map: Map;
    }
  | {
      type: 'EDIT_INPUT';
      input: {
        label: string;
        address?: string;
        location?: { lat: number; lng: number };
      };
      index: number;
    }
  | {
      type: 'EDIT_GEOCODE_SUGGESTIONS';
      geocodeResults: MapiRequest['body']['features'];
      index: number;
    }
  | {
      type: 'ADD_MARKERS';
      markers: mapboxgl.Marker[];
    }
  | {
      type: 'MOVE_MARKER';

      location: { lat: number; lng: number };
      index: number;
    }
  | {
      type: 'RESET_CLICKED_INDEX';
    }
  | {
      type: 'MOVE_MARKER_BY_DRAGGING';
      location: { lat: number; lng: number };
      index: number;
    }
  | {
      type: 'CLEAR_INPUT';
    }
  | {
      type: 'INITIALIZE_GEOCODER';
      geocoder: GeocodeService;
    };

const useGlobalState = () => useReducer(reducer, initialState);

export const { Provider, useTrackedState, useUpdate } = createContainer(
  useGlobalState
);

import { useReducer, useState } from 'react';
import { createContainer } from 'react-tracked';
import { Input } from '../types/Input';
import { View } from '../types/View';
import { editInput } from './editInput';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Map } from 'mapbox-gl';

export type GlobalState = {
  apiKey: string | undefined;
  inputs: Input[];
  map: Map | undefined;
  view: View;
};

const initialState: GlobalState = {
  apiKey: undefined,
  inputs: [],
  map: undefined,
  view: {
    location: { lat: 38.540604, lng: -121.766941 },
    zoom: 12,
  },
};

export type Action =
  | {
      type: 'SET_ACCESS_TOKEN';
      accessToken: string;
    }
  | {
      type: 'ADD_INPUTS';
      inputs: Input[];
    }
  | {
      type: 'SET_VIEW';
      view: View;
    }
  | {
      type: 'SET_MAP';
      map: Map;
    }
  | {
      type: 'EDIT_INPUT';
      input: Input;
      index?: number;
    }
  | {
      type: 'SET_GEOCODER';
      geocoder: MapboxGeocoder;
      index: number;
    }
  | {
      type: 'CLEAR_INPUT';
    };

const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        apiKey: action.accessToken,
      };
    case 'ADD_INPUTS':
      return {
        ...state,
        inputs: [...state.inputs, ...action.inputs],
      };
    case 'SET_VIEW':
      return {
        ...state,
        view: action.view,
      };
    case 'SET_MAP':
      return {
        ...state,
        map: action.map,
      };
    case 'EDIT_INPUT':
      return editInput(state, action.input, action.index);
    case 'SET_GEOCODER':
      return setGeocoder(state, action.geocoder, action.index);
    case 'CLEAR_INPUT':
      return {
        ...state,
        inputs: state.inputs.map((item) => ({
          label: item.label,
          htmlElement: item.htmlElement,
          geocoder: item.geocoder,
        })),
      };
    default:
      return state;
  }
};

const setGeocoder = (
  state: GlobalState,
  geocoder: MapboxGeocoder,
  index: number
) => {
  const newState = { ...state };
  newState.inputs[index].geocoder = geocoder;
  return newState;
};

const useGlobalState = () => useReducer(reducer, initialState);

export const { Provider, useTrackedState, useUpdate } = createContainer(
  useGlobalState
);

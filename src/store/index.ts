import { useReducer, useState } from 'react';
import { createContainer } from 'react-tracked';
import { Input } from '../types/Input';
import { View } from '../types/View';
import { useGeocoder } from '../uses/useGeocoder';
import { editInput } from './editInput';

export type GlobalState = {
  apiKey: string | undefined;
  inputs: Input[];
  geocoder: google.maps.Geocoder | undefined;
  view: View;
};

const initialState: GlobalState = {
  apiKey: undefined,
  inputs: [],
  geocoder: undefined,
  view: {
    location: { lat: 38.540604, lng: -121.766941 },
    zoom: 12,
  },
};

export type Action =
  | {
      type: 'ADD_INPUTS';
      inputs: Input[];
    }
  | {
      type: 'SET_VIEW';
      view: View;
    }
  | {
      type: 'EDIT_INPUT';
      input: Input;
      index?: number;
    }
  | {
      type: 'SET_GEOCODER';
      geocoder: google.maps.Geocoder;
    }
  | {
      type: 'CLEAR_INPUT';
    };

const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
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
    case 'EDIT_INPUT':
      return editInput(state, action.input, action.index);
    case 'SET_GEOCODER':
      return {
        ...state,
        geocoder: action.geocoder,
      };
    case 'CLEAR_INPUT':
      return {
        ...state,
        inputs: state.inputs.map((item) => ({
          label: item.label,
          htmlElement: item.htmlElement,
        })),
      };
    default:
      return state;
  }
};

const useGlobalState = () => useReducer(reducer, initialState);

export const { Provider, useTrackedState, useUpdate } = createContainer(
  useGlobalState
);

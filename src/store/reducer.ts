import { editInput } from './editInput';
import { findStandbyIndex } from '../utils/findStandbyIndex';
import { GlobalState, Action } from '.';
import { mapClick } from './mapClick';

export const reducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'SET_ACCESS_TOKEN':
      return {
        ...state,
        accessToken: action.accessToken,
      };
    case 'INITIALIZE_GEOCODER': {
      return {
        ...state,
        geocoder: action.geocoder,
      };
    }
    case 'ADD_INPUTS':
      return {
        ...state,
        inputs: [...state.inputs, ...action.inputs],
      };
    case 'ADD_MARKERS':
      return {
        ...state,
        markers: [...state.markers, ...action.markers],
      };
    case 'MAP_CLICK':
      return mapClick({ ...state }, action);
    case 'MAP_MOVE':
      return {
        ...state,
        view: {
          ...state.view,
          location: action.location,
        },
      };
    case 'MAP_ZOOM':
      return {
        ...state,
        view: {
          ...state.view,
          zoom: action.zoom,
        },
      };
    case 'INITIALIZE_MAP':
      return {
        ...state,
        map: action.map,
      };
    case 'EDIT_INPUT':
      return editInput({ ...state }, action.input, action.index);
    case 'MOVE_MARKER': {
      const newState = { ...state };
      newState.markers[action.index].setLngLat([
        action.location.lng,
        action.location.lat,
      ]);
      return newState;
    }
    case 'RESET_CLICKED_INDEX':
      return {
        ...state,
        clickedIndex: undefined,
      };
    case 'MOVE_MARKER_BY_DRAGGING': {
      const newState = { ...state };
      newState.markers[action.index].setLngLat([
        action.location.lng,
        action.location.lat,
      ]);
      newState.inputs[action.index].location = action.location;
      newState.view.location = action.location;
      newState.clickedIndex = action.index;
      return newState;
    }
    case 'CLEAR_INPUT':
      return {
        ...state,
        inputs: state.inputs.map((item) => {
          if (item.htmlElement?.value) {
            item.htmlElement.value = '';
          }
          return {
            label: item.label,
            htmlElement: item.htmlElement,
          };
        }),
        markers: state.markers.map((item) => item.setLngLat([0, 90])),
      };
    case 'EDIT_GEOCODE_SUGGESTIONS': {
      const newState = { ...state };
      newState.inputs[action.index].geocoderSuggestions = action.geocodeResults;
      return newState;
    }
    case 'EDIT_TEXTFIELD_VALUE': {
      const newState = { ...state };
      newState.inputs[action.index].textfieldValue = action.value;
      return newState;
    }
    case 'EDIT_TEXTFIELD_INPUT_VALUE': {
      const newState = { ...state };
      newState.inputs[action.index].textfieldInputValue = action.value;
      return newState;
    }
    default:
      return state;
  }
};

export const moveMarker = (
  state: GlobalState,
  marker: mapboxgl.Marker,
  index: number,
) => {
  const newState = { ...state };
  newState.markers[index] = marker;
  return newState;
};

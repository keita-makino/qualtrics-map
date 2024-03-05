import { Action, GlobalState } from '.';
import { findStandbyIndex } from '../utils/findStandbyIndex';

export const mapClick = (
  state: GlobalState,
  action: {
    type: 'MAP_CLICK';
    location: { lat: number; lng: number };
  },
) => {
  const newState = { ...state };
  const index = findStandbyIndex(newState);
  newState.markers[index].setLngLat([action.location.lng, action.location.lat]);
  newState.inputs[index].location = action.location;
  newState.view.location = action.location;
  newState.clickedIndex = index;
  return newState;
};

import { Input } from '../types/Input';
import { Action, GlobalState } from './index';

export const editInput = (
  _state: GlobalState,
  input: Input,
  _index: number | undefined
) => {
  const state = { ..._state };
  const index =
    _index !== undefined
      ? _index
      : state.inputs.findIndex((item) => item.location === undefined);
  if (index !== -1) {
    if (state.geocoder) {
      if (input.location) {
        state.view.location = input.location;
        state.inputs[index].htmlElement!.value = JSON.stringify(input.location);
      }
      state.inputs[index].location = input.location;
      state.inputs[index].address = input.address;
    }
  }
  return state;
};

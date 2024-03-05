import { Input } from '../types/Input';
import { Action, GlobalState } from './index';

export const editInput = (_state: GlobalState, input: Input, index: number) => {
  const state = { ..._state };
  if (index !== -1) {
    if (input.location) {
      state.view.location = input.location;
      state.inputs[index].htmlElement!.value = JSON.stringify(input.location);
    } else {
      state.inputs[index].htmlElement!.value = '';
    }
    state.inputs[index].location = input.location;
    state.inputs[index].address = input.address;
  }
  return state;
};

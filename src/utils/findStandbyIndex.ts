import { GlobalState } from '../store';

export const findStandbyIndex = (state: GlobalState) => {
  const index = state.inputs.findIndex((item) => item.location === undefined);
  return index === -1 ? state.inputs.length - 1 : index;
};

import { useMemo, useState } from 'react';
import { useTrackedState } from '../store';

export const useStandbyIndex = () => {
  const state = useTrackedState();
  const [index, setIndex] = useState<number>(0);

  useMemo(() => {
    const newIndex = state.inputs.findIndex(
      (item) => item.location === undefined,
    );
    newIndex === -1 ? setIndex(0) : setIndex(newIndex);
  }, [state.inputs]);

  return index;
};

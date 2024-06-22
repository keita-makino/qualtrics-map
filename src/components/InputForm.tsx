import { Grid } from '@mui/material';
import React, { useContext } from 'react';
import { useTrackedState } from '../store';
import { InputRow } from './InputFormRow';

export const InputForm: React.FC = () => {
  const state = useTrackedState();

  return (
    <>
      {state.inputs.map((item, index: number) => {
        return <InputRow label={item.label} index={index} />;
      })}
    </>
  );
};

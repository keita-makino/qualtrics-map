import { Grid } from '@mui/material';
import React, { useContext } from 'react';
import { useTrackedState } from '../store';
import { InputRow } from './InputFormRow';

export const InputForm: React.FC = () => {
  const state = useTrackedState();

  return (
    <Grid
      item
      container
      xl={12}
      lg={12}
      md={12}
      sm={12}
      xs={12}
      style={{
        padding: '0 0 1rem 0',
      }}
    >
      {state.inputs.map((item, index: number) => {
        return <InputRow label={item.label} index={index} />;
      })}
    </Grid>
  );
};

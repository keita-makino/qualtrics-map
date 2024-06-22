import { Grid, Button, Typography, makeStyles } from '@mui/material';
import React, { useContext } from 'react';
import { useUpdate } from '../store';
import styled from '@emotion/styled';

export type ClearButtonProps = {};

export const ClearButton: React.FC<ClearButtonProps> = (
  props: ClearButtonProps,
) => {
  const update = useUpdate();

  const StyledButton = styled(Button)`
    color: white !important;
  `;

  return (
    <Grid
      item
      container
      xl={6}
      lg={6}
      md={6}
      sm={6}
      xs={6}
      justifyContent={'center'}
      style={{ position: 'relative', top: '-4rem' }}
    >
      <StyledButton
        variant={'contained'}
        color={'primary'}
        onClick={() => update({ type: 'CLEAR_INPUT' })}
      >
        <Typography variant={'button'}>Clear Pin(s)</Typography>
      </StyledButton>
    </Grid>
  );
};

import { Grid, Button, Typography, makeStyles } from '@material-ui/core';
import { Marker } from '@react-google-maps/api';
import React, { useContext } from 'react';
import { useUpdate } from '../store';

export type ClearButtonProps = {};

const useStyles = makeStyles({
  button: {
    color: 'white !important',
  },
});

export const ClearButton: React.FC<ClearButtonProps> = (
  props: ClearButtonProps
) => {
  const classes = useStyles();
  const update = useUpdate();

  return (
    <Grid container justify={'center'}>
      <Grid
        item
        container
        xl={6}
        lg={6}
        md={6}
        sm={6}
        xs={6}
        justify={'center'}
        style={{ position: 'relative', top: '-3rem' }}
      >
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={() => update({ type: 'CLEAR_INPUT' })}
          className={classes.button}
        >
          <Typography variant={'button'}>Clear Pin(s)</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

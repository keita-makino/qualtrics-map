import {
  Grid,
  Box,
  makeStyles,
  Autocomplete,
  TextField,
  CircularProgress,
} from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTrackedState, useUpdate } from '../store';
import styled from '@emotion/styled';
import { LngLat } from 'mapbox-gl';
import { useGeocodeSuggestions } from '../uses/useGeocodeSuggestions';

export type InputRowProps = { label: string; index: number };

const StyledGrid = styled(Grid)`
  padding: 0.5rem 0;
  & input {
    border: none !important;
    background: none !important;
  }
`;

export const InputRow: React.FC<InputRowProps> = (props: InputRowProps) => {
  const state = useTrackedState();
  const update = useUpdate();
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const options = useGeocodeSuggestions(props.index);
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  useMemo(() => {
    if (state.inputs[props.index].textfieldValue !== undefined) {
      setValue(state.inputs[props.index].textfieldValue!);
    } else {
      setValue(null);
    }
  }, [state.inputs[props.index].textfieldValue]);

  useMemo(() => {
    if (state.inputs[props.index].textfieldInputValue !== undefined) {
      setInputValue(state.inputs[props.index].textfieldInputValue!);
    } else {
      setInputValue('');
    }
  }, [state.inputs[props.index].textfieldInputValue]);

  useEffect(() => {
    if (state.geocoder) {
      setLoading(false);
    }
  }, [state.geocoder]);

  useEffect(() => {
    setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    if (!isOpen) {
      setLoading(false);
      return;
    }
    timer.current = setTimeout(() => {
      if (inputValue === '') return;
      state.geocoder
        ?.forwardGeocode({
          query: inputValue!,
          limit: 5,
          proximity: [state.view.location.lng, state.view.location.lat],
        })
        .send()
        .then((response) => {
          update({
            type: 'EDIT_GEOCODE_SUGGESTIONS',
            index: props.index,
            geocodeResults: response.body.features,
          });
        });
      setLoading(false);
    }, 1500);
  }, [inputValue]);

  const onChange = (event: any, newValue: string | null, reason: string) => {
    if (reason === 'selectOption' && newValue) {
      update({
        type: 'EDIT_TEXTFIELD_VALUE',
        index: props.index,
        value: newValue,
      });
      const newData = options[event.target.dataset.optionIndex];
      if (newData) {
        update({
          type: 'EDIT_INPUT',
          input: {
            label: props.label,
            location: {
              lat: newData.location.lat,
              lng: newData.location.lng,
            },
            address: newData.address,
          },
          index: props.index,
        });
        update({
          type: 'MOVE_MARKER',
          location: {
            lat: newData.location.lat,
            lng: newData.location.lng,
          },
          index: props.index,
        });
        update({
          type: 'MAP_MOVE',
          location: {
            lat: newData.location.lat,
            lng: newData.location.lng,
          },
        });
        state.map?.easeTo({
          center: [newData.location.lng, newData.location.lat],
          essential: true,
        });
      }
    } else if (reason === 'clear') {
      update({
        type: 'EDIT_TEXTFIELD_INPUT_VALUE',
        index: props.index,
        value: '',
      });
      update({
        type: 'EDIT_TEXTFIELD_VALUE',
        index: props.index,
        value: null,
      });
      update({
        type: 'EDIT_INPUT',
        input: {
          label: props.label,
          location: undefined,
          address: undefined,
        },
        index: props.index,
      });
      update({
        type: 'MOVE_MARKER',
        location: {
          lat: 90,
          lng: 0,
        },
        index: props.index,
      });
      update({
        type: 'EDIT_GEOCODE_SUGGESTIONS',
        index: props.index,
        geocodeResults: [],
      });
    }
  };

  useEffect(() => {
    if (props.index === state.clickedIndex && state.geocoder) {
      state.geocoder
        .reverseGeocode({
          query: [state.view.location.lng, state.view.location.lat],
          limit: 1,
        })
        .send()
        .then((response) => {
          const address = response.body.features[0].place_name;
          update({
            type: 'EDIT_INPUT',
            input: {
              label: props.label,
              location: {
                lat: state.view.location.lat,
                lng: state.view.location.lng,
              },
              address: address,
            },
            index: props.index,
          });
          update({
            type: 'EDIT_TEXTFIELD_INPUT_VALUE',
            index: props.index,
            value: address,
          });
          update({
            type: 'EDIT_TEXTFIELD_VALUE',
            index: props.index,
            value: address,
          });
        });
    }
  }, [state.clickedIndex]);

  return (
    <StyledGrid
      item
      container
      xl={12}
      lg={12}
      md={12}
      sm={12}
      xs={12}
      alignItems={'center'}
    >
      <Box flexGrow={1}>
        <Autocomplete
          onInputChange={(event: any, newInputValue: string | null) => {
            if (newInputValue) {
              update({
                type: 'EDIT_TEXTFIELD_INPUT_VALUE',
                index: props.index,
                value: newInputValue,
              });
            }
          }}
          onChange={onChange}
          onOpen={() => setIsOpen(true)}
          onClose={() => setIsOpen(false)}
          inputValue={inputValue}
          value={value}
          options={options.map((item) => item.address)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={props.label}
              placeholder={
                'Please type address or click the location on the Map.'
              }
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>
    </StyledGrid>
  );
};

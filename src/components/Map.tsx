import React, { useState, useEffect } from 'react';
import { Grid, Button, Box, Typography } from '@material-ui/core';
import {
  GoogleMap,
  Marker as MapMarker,
  Autocomplete,
  LoadScriptNext,
} from '@react-google-maps/api';
import geoCoder from '../utils/geocoder';
import { makeStyles } from '@material-ui/styles';
import { GeocodingRequest } from '@google/maps';
import { Libraries } from '@react-google-maps/api/dist/utils/make-load-script-url';

type PropsBase = {
  apiKey: string;
  directionContainer: HTMLElement;
};
export const defaultValue = {
  apiKey: '',
  directionContainer: {} as HTMLElement,
};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as mapDefaultValue };
export type mapProps = Props;

type Marker =
  | {
      position: {
        lat: number;
        lng: number;
      };
    }
  | undefined;

const libraries: Libraries = ['places'];

const useStyles = makeStyles({
  button: {
    color: 'white !important',
  },
  autocompleteContainer: {
    '& div': {
      width: '100%',
      '& input': {
        width: '100%',
      },
    },
    padding: '0.3rem 0 0.3rem 1rem',
    maxWidth: '75%',
  },
  mapContainer: {
    paddingTop: '2rem',
    '& [aria-label *= "Street View Pegman Control"]': {
      height: '30px !important',
    },
  },
});

const Map: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = _props as Props;
  const classes = useStyles();
  const initialLocation: () => GeocodingRequest = () => {
    const region = (window as any).countryCode || 'US';
    const address = (window as any).postalCode
      ? `${region} ${(window as any).postalCode}`
      : region;
    return { address: address };
  };

  const labels = [
    ...props.directionContainer.getElementsByTagName('label'),
  ].map((item) => {
    return item.children[0].textContent ? item.children[0].textContent : '';
  });
  const numPins = labels.length;
  const inputs = props.directionContainer.getElementsByTagName('input');

  const [markers, setMarkers] = useState(
    Array<Marker>(numPins).fill(undefined)
  );
  const [autocompletes, setAutocompletes] = useState(
    Array(numPins).fill(undefined)
  );
  const [addresses, setAddresses] = useState(Array(numPins).fill(''));
  const [center, setCenter] = useState({
    lat: 37.542096,
    lng: -121.771202,
  });
  const [map, setMap] = useState({ zoom: 14 });

  useEffect(() => {
    [...inputs].map((item, index) => {
      if (item.value !== '') {
        placePin(index, JSON.parse(item.value), undefined);
      }
    });
    geoCoder(props.apiKey).geocode(
      initialLocation(),
      (error: any, result: any) => {
        setCenter(result.json.results[0].geometry.location);
      }
    );
  }, []);

  const clickMap = (index: number | undefined, event: any) => {
    const coordinates = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    placePin(index, coordinates, undefined);
  };

  const setAddress = (index: number, address: string) => {
    setAddresses((state: any) => {
      const newState = [...state];
      newState[index] = address;
      return newState;
    });
  };

  const placePin = (
    _index?: number,
    coordinates?: { lat: number; lng: number },
    address?: string
  ) => {
    const index = _index !== undefined ? _index : markers.indexOf(undefined);
    if (index < numPins && index !== -1) {
      if (coordinates) {
        inputs[index].value = JSON.stringify(coordinates);
        setCenter(coordinates);
        setMarkers((state) => {
          const newState = [...state];
          newState[index] = {
            position: coordinates,
          };
          return newState;
        });
        geoCoder(props.apiKey).reverseGeocode(
          { latlng: { lat: coordinates.lat, lng: coordinates.lng } },
          (error: any, result: any) => {
            setAddress(index, result.json.results[index].formatted_address);
          }
        );
      } else if (address) {
        geoCoder(props.apiKey).geocode(
          {
            address: address,
          },
          (error: any, result: any) => {
            setCenter(result.json.results[0].geometry.location);
            inputs[index].value = JSON.stringify(
              result.json.results[0].geometry.location
            );
            setMarkers((state: any) => {
              const newState = [...state];
              newState[index] = {
                position: result.json.results[0].geometry.location,
              };
              return newState;
            });
          }
        );
        setAddress(index, address);
      }
    }
  };

  return (
    <Grid container>
      <LoadScriptNext
        id="script-loader"
        googleMapsApiKey={props.apiKey}
        libraries={libraries}
      >
        <>
          <Grid item container xl={12} lg={12} md={12} sm={12} xs={12}>
            {labels.map((item: any, index: number) => {
              return (
                <Grid
                  item
                  container
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  alignItems={'center'}
                  justify={'space-between'}
                >
                  {item}
                  <Box flexGrow={1} className={classes.autocompleteContainer}>
                    <Autocomplete
                      onLoad={(autocomplete: any) => {
                        setAutocompletes((state: any) => {
                          const newState = [...state];
                          newState[index] = autocomplete;
                          return newState;
                        });
                      }}
                      onPlaceChanged={() => {
                        placePin(
                          index,
                          undefined,
                          autocompletes[index].getPlace().formatted_address
                        );
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search address or drop a pin on the map"
                        value={addresses[index]}
                        onChange={({ target: { value } }) => {
                          setAddress(index, value);
                        }}
                      />
                    </Autocomplete>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
          <Grid
            item
            container
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
            className={classes.mapContainer}
          >
            <GoogleMap
              id="map"
              clickableIcons={false}
              mapContainerStyle={{
                width: '100%',
                height: '60vh',
              }}
              zoom={map.zoom}
              center={center}
              onClick={(event) => {
                clickMap(undefined, event);
              }}
              onLoad={(map) => {
                setMap(map);
              }}
            >
              {markers.map((item: Marker, index: number) => {
                if (item) {
                  const label =
                    labels[index] !== ''
                      ? {
                          text: labels[index],
                          fontWeight: 'bold',
                        }
                      : null;
                  return (
                    <MapMarker
                      draggable={true}
                      onDragEnd={(event: any) => {
                        clickMap(index, event);
                      }}
                      label={label}
                      position={item.position}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </GoogleMap>
          </Grid>
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
                onClick={() => {
                  [...inputs].map((item) => (item.value = ''));
                  setMarkers(Array<Marker>(numPins).fill(undefined));
                  addresses.map((item: any, index: number) => {
                    setAddress(index, '');
                  });
                }}
                className={classes.button}
              >
                <Typography variant={'button'}>Clear Pin(s)</Typography>
              </Button>
            </Grid>
          </Grid>
        </>
      </LoadScriptNext>
    </Grid>
  );
};
Map.defaultProps = defaultValue;

export default Map;

import React, { useState, useEffect } from 'react';
import { Grid, Button, Box } from '@material-ui/core';
import {
  GoogleMap,
  LoadScript,
  Marker as MapMarker,
  Autocomplete
} from '@react-google-maps/api';
import useGeolocation from 'react-hook-geolocation';
import geoCoder from '../utils/geocoder';
import { makeStyles } from '@material-ui/styles';

type PropsBase = {
  apiKey: string;
  numPins: number;
  returnType: string;
  labels: string[];
};
export const defaultValue = {
  apiKey: '',
  numPins: 1,
  returnType: 'address',
  labels: []
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

const libraries = ['places'];

const useStyles = makeStyles({
  button: {
    color: 'white !important'
  },
  autocompleteContainer: {
    '& div': {
      width: '100%',
      '& input': {
        width: '100%'
      }
    },
    padding: '0.3rem 0 0.3rem 0'
  },
  mapContainer: {
    paddingTop: '2rem',
    '& [aria-label *= "Street View Pegman Control"]': {
      height: '30px !important'
    }
  }
});

const Map: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = _props as Props;
  const classes = useStyles();
  const location = useGeolocation();

  const [markers, setMarkers] = useState(
    Array<Marker>(props.numPins).fill(undefined)
  );
  const [autocompletes, setAutocompletes] = useState(
    Array(props.numPins).fill(undefined)
  );

  const [addresses, setAddresses] = useState(Array(props.numPins).fill(''));
  const [center, setCenter] = useState({
    lat: 38.542096,
    lng: -121.771202
  });

  useEffect(() => {
    if (location.latitude !== null) {
      setCenter({
        lat: location.latitude,
        lng: location.longitude
      });
    }
  }, [location.latitude, location.longitude]);

  const inputs = document
    .getElementsByClassName('ChoiceStructure')[0]
    .getElementsByTagName('input');

  const clickMap = (index: number | undefined, event: any) => {
    const coordinates = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    placePin(index, coordinates, undefined);
  };

  const setAddress = (index: number, address: string) => {
    setAddresses(state => {
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
    if (markers.filter(Boolean).length < props.numPins) {
      const index = _index ? _index : markers.indexOf(undefined);

      if (coordinates) {
        inputs[index].value = JSON.stringify(coordinates);
        setMarkers(state => {
          const newState = [...state];
          newState[index] = {
            position: coordinates
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
            address: address
          },
          (error: any, result: any) => {
            inputs[index].value = JSON.stringify(
              result.json.results[0].geometry.location
            );
            setMarkers(state => {
              const newState = [...state];
              newState[index] = {
                position: result.json.results[0].geometry.location
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
      <LoadScript
        id="script-loader"
        googleMapsApiKey={props.apiKey}
        libraries={libraries}
      >
        <Grid item container xl={12} lg={12} md={12} sm={12} xs={12}>
          {props.labels.map((item: any, index: number) => {
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
              >
                {item}
                <Box flexGrow={1} className={classes.autocompleteContainer}>
                  <Autocomplete
                    onLoad={autocomplete => {
                      setAutocompletes(state => {
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
              height: '60vh'
            }}
            zoom={15}
            center={center}
            onClick={event => {
              clickMap(undefined, event);
            }}
          >
            {markers.map((item: Marker, index: number) => {
              if (item) {
                return (
                  <MapMarker
                    draggable={true}
                    onDragEnd={event => {
                      clickMap(index, event);
                    }}
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
            style={{ position: 'relative', top: '-3.5rem' }}
          >
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={() => {
                [...inputs].map(item => (item.value = ''));
                setMarkers(Array<Marker>(props.numPins).fill(undefined));
                addresses.map((item, index) => {
                  setAddress(index, '');
                });
              }}
              className={classes.button}
            >
              Clear Pin(s)
            </Button>
          </Grid>
        </Grid>
      </LoadScript>
    </Grid>
  );
};
Map.defaultProps = defaultValue;

export default Map;

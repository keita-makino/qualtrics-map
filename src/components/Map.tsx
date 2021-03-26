import React, { useState, useEffect, useCallback } from 'react';
import { Grid, Button, Box, Typography } from '@material-ui/core';
import {
  GoogleMap,
  Marker as MapMarker,
  Autocomplete,
  useLoadScript,
} from '@react-google-maps/api';
import { makeStyles } from '@material-ui/styles';

type PropsBase = {
  apiKey: string;
  directionContainer: HTMLElement;
  defaultLocation?: {
    lat: number;
    lng: number;
  };
};
export const defaultValue: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = {
  apiKey: '',
  directionContainer: {} as HTMLElement,
  defaultLocation: { lat: 38.540604, lng: -121.766941 },
};
const PropsDefault = defaultValue;
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

const libraries: (
  | 'drawing'
  | 'geometry'
  | 'localContext'
  | 'places'
  | 'visualization'
)[] = ['places'];

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
  const isCenterProvided = _props.defaultLocation !== undefined;
  const props = _props as Props;
  const classes = useStyles();
  const initialLocation = () => {
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
  const [map, setMap] = useState({});

  const [markers, setMarkers] = useState(
    Array<Marker>(numPins).fill(undefined)
  );
  const [autocompletes, setAutocompletes] = useState(
    Array(numPins).fill(undefined)
  );
  const [addresses, setAddresses] = useState(Array(numPins).fill(''));
  const [center, setCenter] = useState(props.defaultLocation);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: props.apiKey,
    libraries,
  });
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  const initializeGeocoder = useCallback(() => {
    const map = window?.google?.maps;

    if (map) {
      setGeocoder(new map.Geocoder());
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      initializeGeocoder();
    }
  }, [isLoaded, initializeGeocoder]);

  useEffect(() => {
    [...inputs].map((item, index) => {
      if (item.value !== '') {
        placePin(index, JSON.parse(item.value), undefined);
      }
    });
  }, []);

  useEffect(() => {
    if (geocoder && !isCenterProvided) {
      geocoder.geocode(initialLocation(), (results, status) => {
        if (results) {
          console.log(results[0].geometry.location.toJSON());
          setCenter(results[0].geometry.location.toJSON());
        }
      });
    }
  }, [geocoder, isCenterProvided]);

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
      if (coordinates && geocoder) {
        inputs[index].value = JSON.stringify(coordinates);
        setCenter(coordinates);
        setMarkers((state) => {
          const newState = [...state];
          newState[index] = {
            position: coordinates,
          };
          return newState;
        });
        geocoder.geocode(
          { location: { lat: coordinates.lat, lng: coordinates.lng } },
          (results, status) => {
            if (results) {
              setAddress(index, results[0].formatted_address);
            }
          }
        );
      } else if (address && geocoder) {
        geocoder.geocode(
          {
            address: address,
          },
          (results, status) => {
            if (results) {
              setCenter(results[0].geometry.location.toJSON());
              inputs[index].value = JSON.stringify(
                results[0].geometry.location.toJSON()
              );
              setMarkers((state: any) => {
                const newState = [...state];
                newState[index] = {
                  position: results[0].geometry.location.toJSON(),
                };
                return newState;
              });
            }
          }
        );
        setAddress(index, address);
      }
    }
  };

  const renderMapComponent = () => (
    <Grid container>
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
          center={center}
          onClick={(event) => {
            clickMap(undefined, event);
          }}
          zoom={14}
          onLoad={(map) => {
            setMap(map);
          }}
        >
          {markers.map((item: Marker, index: number) => {
            if (item) {
              const label: google.maps.MarkerLabel | null =
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
                  label={label || undefined}
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
    </Grid>
  );

  return isLoaded ? renderMapComponent() : <span>An error has occured.</span>;
};
Map.defaultProps = defaultValue;

export default Map;

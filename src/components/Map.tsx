import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import {
  GoogleMap,
  LoadScript,
  Marker as MapMarker,
  Autocomplete
} from '@react-google-maps/api';
import useGeolocation from 'react-hook-geolocation';
import geoCoder from '../utils/geocoder';

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

const Map: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = _props as Props;
  const location = useGeolocation();

  const [markers, setMarkers] = useState(
    Array<Marker>(props.numPins).fill(undefined)
  );
  const [autocompletes, setAutocompletes] = useState(
    Array<any>(props.numPins).fill(undefined)
  );

  const [addresses, setAddresses] = useState(Array(3).fill(''));
  const [center, setCenter] = useState({
    lat: 35.45,
    lng: 139.53
  });
  const [value, setValue] = useState('');

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

  const clickMap = (event: any) => {
    const coordinates = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    placePin(coordinates);
  };

  const placePin = (coordinates: { lat: number; lng: number }, i?: number) => {
    if (markers.filter(Boolean).length < props.numPins) {
      const index = i ? i : markers.indexOf(undefined);

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
          setAddresses(state => {
            const newState = [...state];
            newState[index] = result.json.results[index].formatted_address;
            return newState;
          });
        }
      );
      console.log(markers);
      console.log(addresses);
    }
  };

  return (
    <Grid container>
      <LoadScript
        id="script-loader"
        googleMapsApiKey={props.apiKey}
        libraries={libraries}
      >
        <Grid item container xl={8} lg={8} md={12} sm={12} xs={12}>
          {props.labels.map((item: any, index: number) => {
            return (
              <Grid item container xl={8} lg={8} md={12} sm={12} xs={12}>
                {item}
                <Autocomplete
                  onLoad={autocomplete => {
                    setAutocompletes(state => {
                      const newState = [...state];
                      newState[index] = autocomplete;
                      return newState;
                    });
                  }}
                  onPlaceChanged={() => {
                    geoCoder(props.apiKey).geocode(
                      {
                        address: autocompletes[index].getPlace()
                          .formatted_address
                      },
                      (error: any, result: any) => {
                        setValue(result.json.results[0].formatted_address);
                        placePin(
                          result.json.results[0].geometry.location,
                          index
                        );
                      }
                    );
                  }}
                >
                  <input
                    type="text"
                    placeholder="Customized your placeholder"
                    value={addresses[index]}
                    onChange={({ target: { value } }) => {
                      setAddresses(state => {
                        const newState = [...state];
                        newState[index] = value;
                        return newState;
                      });
                    }}
                  />
                </Autocomplete>
              </Grid>
            );
          })}
        </Grid>
        <Grid item container xl={8} lg={8} md={12} sm={12} xs={12}>
          <GoogleMap
            id="map"
            mapContainerStyle={{
              width: '100%',
              height: '60vh'
            }}
            zoom={15}
            center={center}
            onClick={(event: any) => {
              clickMap(event);
            }}
          >
            {markers.filter(Boolean).map((item: Marker) => {
              return <MapMarker position={item!.position} />;
            })}
          </GoogleMap>
        </Grid>
        <Grid
          item
          container
          justify={'center'}
          xl={8}
          lg={8}
          md={12}
          sm={12}
          xs={12}
          style={{ position: 'relative', top: '-3rem' }}
        >
          <Button
            variant={'contained'}
            color={'primary'}
            onClick={() => {
              [...inputs].map(item => (item.value = ''));
              setMarkers([] as Marker[]);
            }}
            style={{
              color: 'white !important'
            }}
          >
            Clear Pin(s)
          </Button>
        </Grid>
      </LoadScript>
    </Grid>
  );
};
Map.defaultProps = defaultValue;

export default Map;

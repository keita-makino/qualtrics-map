import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@material-ui/core';
import {
  GoogleMap,
  LoadScript,
  Marker as MapMarker
} from '@react-google-maps/api';
import useGeolocation from 'react-hook-geolocation';
import geoCoder from '../utils/geocoder';

type PropsBase = {
  apiKey: string;
  numPins: number;
  returnType: string;
};
export const defaultValue = {
  apiKey: '',
  numPins: 1,
  returnType: 'address'
};
const PropsDefault: Required<
  Pick<PropsBase, { [Key in keyof PropsBase]-?: Key }[keyof PropsBase]>
> = defaultValue;
type Props = PropsBase & typeof PropsDefault;

export { defaultValue as mapDefaultValue };
export type mapProps = Props;

type Marker = {
  position: {
    lat: number;
    lng: number;
  };
  address: string;
};

const Map: React.FC<PropsBase> = (_props: PropsBase) => {
  const props = _props as Props;
  const location = useGeolocation();

  const [markers, setMarkers] = useState([] as Marker[]);
  const [center, setCenter] = useState({
    lat: 35.45,
    lng: 139.53
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

  return (
    <Grid container>
      <Grid item container xl={8} lg={8} md={12} sm={12} xs={12}>
        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
          <LoadScript id="script-loader" googleMapsApiKey={props.apiKey}>
            <GoogleMap
              id="map"
              mapContainerStyle={{
                width: '100%',
                height: '60vh'
              }}
              zoom={15}
              center={center}
              onClick={(event: any) => {
                if (markers.length < props.numPins) {
                  const coordinates = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                  };
                  geoCoder(props.apiKey).reverse(
                    { lat: coordinates.lat, lon: coordinates.lng },
                    (error: any, result: any) => {
                      inputs[markers.length].value = result[0].formattedAddress;
                      setMarkers([
                        ...markers,
                        {
                          position: coordinates,
                          address: result[0].formattedAddress
                        }
                      ]);
                    }
                  );
                }
              }}
            >
              {markers.map((item: Marker) => {
                return <MapMarker position={item.position} />;
              })}
            </GoogleMap>
          </LoadScript>
        </Grid>
        <Grid
          item
          container
          justify={'center'}
          xl={12}
          lg={12}
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
          >
            Clear Pin(s)
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
Map.defaultProps = defaultValue;

export default Map;

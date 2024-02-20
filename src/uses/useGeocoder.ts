import mapboxgl from 'mapbox-gl';
import { useState, useCallback, useEffect } from 'react';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export const useGeocoder = (isLoaded: boolean) => {
  const [geocoder, setGeocoder] = useState<MapboxGeocoder | null>(null);

  const initializeGeocoder = useCallback(() => {}, []);

  useEffect(() => {
    if (isLoaded) {
      initializeGeocoder();
    }
  }, [isLoaded, initializeGeocoder]);

  return geocoder;
};

import { useState, useCallback, useEffect } from 'react';

export const useGeocoder = (isLoaded: boolean) => {
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

  return geocoder;
};

import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

export type Input = {
  label: string;
  htmlElement?: HTMLInputElement;
  address?: string;
  location?: {
    lng: number;
    lat: number;
  };
  geocoder?: MapboxGeocoder;
};

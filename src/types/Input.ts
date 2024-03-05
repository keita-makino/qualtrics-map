import { GeocodeResponse } from '@mapbox/mapbox-sdk/services/geocoding';

export type Input = {
  label: string;
  htmlElement?: HTMLInputElement;
  address?: string;
  location?: {
    lng: number;
    lat: number;
  };
  textfieldInputValue?: string;
  textfieldValue?: string | null;
  geocoderSuggestions?: GeocodeResponse['features'];
};

import { createClient } from '@google/maps';

const geocoder = (apiKey: string) => {
  const geocoder = createClient({
    key: apiKey,
    Promise: Promise,
  });

  return geocoder;
};

export default geocoder;

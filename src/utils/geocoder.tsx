import maps from '@google/maps';

const geocoder = (apiKey: string) => {
  const geocoder = maps.createClient({
    key: apiKey,
    Promise: Promise
  });

  return geocoder;
};

export default geocoder;

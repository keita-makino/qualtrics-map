import NodeGeocoder from 'node-geocoder';

const geocoder = (apiKey: string) => {
  const options = {
    provider: 'google',
    apiKey: apiKey
  };
  return NodeGeocoder(options);
};

export default geocoder;

import React from 'react';
import Map from './components/Map';

const App: React.FC<{ apiKey: string }> = props => {
  return (
    <>
      <Map apiKey={props.apiKey} />
    </>
  );
};

export default App;

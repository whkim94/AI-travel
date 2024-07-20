import React from 'react';
import { LoadScript } from '@react-google-maps/api';

interface Location {
  name: string;
  address: string;
}

interface ActivityMapProps {
  locations: Location[];
}

const ActivityMap: React.FC<ActivityMapProps> = ({ locations }) => {
  const mapStyles = {
    height: '50vh',
    width: '100%',
  };

  const defaultCenter = { lat: 40.7128, lng: -74.006 }; // New York City coordinates

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      {/* <GoogleMap mapContainerStyle={mapStyles} zoom={13} center={defaultCenter}>
        {locations.map((location, index) => (
          <Marker key={index} position={defaultCenter} /> // You'll need to geocode the address to get actual coordinates
        ))}
      </GoogleMap> */}
    </LoadScript>
  );
};

export default ActivityMap;

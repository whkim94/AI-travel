import React, { useState } from 'react';

import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';

import { getRandomLocation } from 'src/utils/randomLocation';

interface LocationInputProps {
  onLocationSubmit: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationSubmit }) => {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
            );
            const data = await response.json();
            if (data) {
              const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.hamlet;
              const { country } = data.address;
              if (city && country) {
                const locationString = `${city}, ${country}`;
                setLocation(locationString);
                onLocationSubmit(locationString);
              }
            }
          } catch (error) {
            console.error('Error fetching location name:', error);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const getRandomLocationHandler = () => {
    const randomLoc = getRandomLocation();
    setLocation(randomLoc);
    onLocationSubmit(randomLoc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location) {
      onLocationSubmit(location);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Choose Your Location
      </Typography>
      <Button
        fullWidth
        variant="outlined"
        onClick={getCurrentLocation}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Use Current Location'}
      </Button>
      <Button
        fullWidth
        variant="outlined"
        onClick={getRandomLocationHandler}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        Get Random Location
      </Button>
      <Typography variant="body2" gutterBottom>
        Or enter a location manually:
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="location"
          label="Location"
          name="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isLoading}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading || !location}
          sx={{ mt: 2 }}
        >
          Confirm Location
        </Button>
      </Box>
    </Box>
  );
};

export default LocationInput;

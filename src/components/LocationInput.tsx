import React, { useState } from 'react';

import MyLocationIcon from '@mui/icons-material/MyLocation';
import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

interface LocationInputProps {
  open: boolean;
  onClose: () => void;
  onLocationSubmit: (location: string) => void;
  currentLocation: string | null;
}

const LocationInput: React.FC<LocationInputProps> = ({
  open,
  onClose,
  onLocationSubmit,
  currentLocation,
}) => {
  const [location, setLocation] = useState(currentLocation || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleManualSubmit = () => {
    if (location.trim()) {
      onLocationSubmit(location.trim());
      onClose();
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoading(true);
      setError(null);
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
                onClose();
              }
            }
          } catch (err) {
            console.error('Error fetching location name:', err);
            setError('Failed to get location. Please enter manually.');
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to get your location. Please enter manually.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter location manually.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Location</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          autoComplete="off"
          margin="dense"
          id="location"
          label="Location"
          type="text"
          fullWidth
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isLoading}
        />
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={getCurrentLocation}
          disabled={isLoading}
          startIcon={<MyLocationIcon />}
          sx={{ mt: 2 }}
        >
          Use Current Location
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleManualSubmit} disabled={!location.trim() || isLoading}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LocationInput;

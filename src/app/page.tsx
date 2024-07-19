'use client';

import { useState, useEffect } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Alert, Button, Container, Typography, CircularProgress } from '@mui/material';

import MoodForm from 'src/components/MoodForm';
import Itinerary from 'src/components/Itinerary';
import LocationInput from 'src/components/LocationInput';

interface ItineraryActivity {
  activity: string;
  location: {
    name: string;
    address: string;
  };
  imageUrl: string;
  additionalInfo: {
    cost?: string;
    duration?: string;
    tips?: string;
    [key: string]: string | undefined;
  };
}

interface ItineraryData {
  colorCode: string;
  activities: ItineraryActivity[];
}

export default function Home() {
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);

  const handleLocationSubmit = (locationData: string) => {
    setLocation(locationData);
  };

  const handleMoodSubmit = async (mood: string) => {
    if (!location) {
      setError('Please confirm your location first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/getItinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, location }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch itinerary');
      }
      const data = await response.json();
      setItineraryData(data);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      setError('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItineraryData(null);
    setLocation(null);
    setError(null);
    // Reset the color to default
    const event = new CustomEvent('colorChange', { detail: '#1976d2' });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    if (itineraryData?.colorCode) {
      const event = new CustomEvent('colorChange', { detail: itineraryData.colorCode });
      window.dispatchEvent(event);
    }
  }, [itineraryData]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            MoodTrek
          </Typography>
          {(location || itineraryData) && (
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleReset}>
              Reset
            </Button>
          )}
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          Your Mood-Based Travel Advisor
        </Typography>
        {!location && <LocationInput onLocationSubmit={handleLocationSubmit} />}
        {location && !itineraryData && (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Current Location: {location}
            </Typography>
            <MoodForm onSubmit={handleMoodSubmit} loading={loading} />
          </>
        )}
        {loading && (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {itineraryData && <Itinerary activities={itineraryData.activities} />}
      </Box>
    </Container>
  );
}

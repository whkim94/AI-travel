'use client';

import React, { useState, useEffect } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import { Box, Alert, Paper, Button, useTheme, Container, Typography } from '@mui/material';

import Itinerary from 'src/components/Itinerary';
import HeroSection from 'src/components/HeroSection';
import ActivityMap from 'src/components/ActivityMap';
import MoodSelector from 'src/components/MoodSelector';
import LocationInput from 'src/components/LocationInput';
import FullPageLoader from 'src/components/FullPageLoader';

interface ItineraryActivity {
  title: string;
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
  const [location, setLocation] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
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
                setLocation(`${city}, ${country}`);
              } else {
                throw new Error('Unable to determine location from coordinates');
              }
            }
          } catch (err) {
            console.error('Error fetching location name:', err);
            setError('Failed to get location automatically. Please enter manually.');
            setIsLocationModalOpen(true);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to get your location automatically. Please enter manually.');
          setIsLocationModalOpen(true);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter location manually.');
      setIsLocationModalOpen(true);
      setLoading(false);
    }
  };

  const handleLocationSubmit = (newLocation: string) => {
    setLocation(newLocation);
    setIsLocationModalOpen(false);
    setError(null);
  };

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    await fetchItinerary(selectedMood);
  };

  const fetchItinerary = async (selectedMood: string) => {
    if (!location) {
      setError('Please set a location first');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/getItinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, location }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch itinerary');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setItineraryData(data);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItineraryData(null);
    setMood(null);
    setLocation(null);
    setError(null);
    getCurrentLocation();
  };

  useEffect(() => {
    if (itineraryData?.colorCode) {
      const event = new CustomEvent('colorChange', { detail: itineraryData.colorCode });
      window.dispatchEvent(event);
    }
  }, [itineraryData]);

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        color: theme.palette.text.primary,
      }}
    >
      {loading && <FullPageLoader message="Generating your personalized itinerary..." />}
      <HeroSection />
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ my: 4, p: 3, backgroundColor: theme.palette.background.paper }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">
              MoodTrek
            </Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<EditLocationIcon />}
                onClick={() => setIsLocationModalOpen(true)}
                sx={{ mr: 1 }}
              >
                Change Location
              </Button>
              <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleReset}>
                Start Over
              </Button>
            </Box>
          </Box>

          {location && (
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: theme.palette.text.secondary }}
            >
              Current Location: {location}
            </Typography>
          )}

          {/* {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          )} */}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {location && !itineraryData && !loading && (
            <MoodSelector onMoodSelect={handleMoodSelect} loading={loading} />
          )}

          {itineraryData && (
            <Box>
              <Itinerary activities={itineraryData.activities} />
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Activity Locations
                </Typography>
                <ActivityMap locations={itineraryData.activities.map((a) => a.location)} />
              </Box>
            </Box>
          )}
        </Paper>
      </Container>

      <LocationInput
        open={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSubmit={handleLocationSubmit}
        currentLocation={location}
      />
    </Box>
  );
}

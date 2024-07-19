'use client';

import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Alert, Button, Container, Typography, CircularProgress } from '@mui/material';

import Itinerary from 'src/components/Itinerary';
import MoodSelector from 'src/components/MoodSelector';
import LocationInput from 'src/components/LocationInput';
import ProgressStepper from 'src/components/ProgressStepper';

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
  const [activeStep, setActiveStep] = useState(0);
  const [location, setLocation] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationSubmit = (locationData: string) => {
    setLocation(locationData);
    setActiveStep(1);
  };

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    if (mood) await fetchItinerary();
  };

  const fetchItinerary = async () => {
    if (!location || !mood) {
      setError('Please select both a location and mood');
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
      setActiveStep(2);
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
    setMood(null);
    setActiveStep(0);
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
    <Box>
      {/* <HeroSection /> */}
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" component="h1">
              MoodTrek
            </Typography>
            {(location || itineraryData) && (
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleReset}>
                Start Over
              </Button>
            )}
          </Box>

          <ProgressStepper activeStep={activeStep} />

          <CSSTransition in={activeStep === 0} timeout={300} classNames="fade" unmountOnExit>
            <LocationInput onLocationSubmit={handleLocationSubmit} />
          </CSSTransition>

          <CSSTransition in={activeStep === 1} timeout={300} classNames="fade" unmountOnExit>
            <MoodSelector onMoodSelect={handleMoodSelect} loading={loading} />
          </CSSTransition>

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

          <CSSTransition
            in={activeStep === 2 && !!itineraryData}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <Box>
              {itineraryData && (
                <>
                  <Itinerary activities={itineraryData.activities} />
                  {/* <Box mt={4}>
                    <Typography variant="h5" gutterBottom>
                      Activity Locations
                    </Typography>
                    <ActivityMap locations={itineraryData.activities.map((a) => a.location)} />
                  </Box> */}
                </>
              )}
            </Box>
          </CSSTransition>
        </Box>
      </Container>
    </Box>
  );
}

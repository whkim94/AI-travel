'use client';

import React, { useState, useEffect } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import {
  Box,
  Alert,
  Button,
  AppBar,
  Toolbar,
  useTheme,
  Container,
  Typography,
} from '@mui/material';

import Itinerary from 'src/components/Itinerary';
// import HeroSection from 'src/components/HeroSection';
import ActivityMap from 'src/components/ActivityMap';
import MoodSelector from 'src/components/MoodSelector';
import LocationInput from 'src/components/LocationInput';
import FullPageLoader from 'src/components/FullPageLoader';
import AnimatedBackground from 'src/components/AnimatedBackground';

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const theme = useTheme();

  const handleLocationSubmit = (newLocation: string) => {
    setLocation(newLocation);
    setIsLocationModalOpen(false);
    setError(null);
  };

  const handleMoodSelect = async (selectedMood: string) => {
    setMood(selectedMood);
    await fetchItinerary(selectedMood);
  };

  const fetchItinerary = async (selectedMood: string, pageNum: number = 1) => {
    if (!location) {
      setError('Please set a location first');
      return;
    }

    setLoading(pageNum === 1);
    setLoadingMore(pageNum > 1);
    setError(null);
    setLoadMoreError(null);

    try {
      const response = await fetch('/api/getItinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, location, page: pageNum }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch itinerary');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      if (pageNum === 1) {
        setItineraryData(data);
      } else {
        setItineraryData((prevData) => ({
          ...prevData!,
          activities: [...prevData!.activities, ...data.activities],
        }));
      }
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      if (pageNum === 1) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } else {
        setLoadMoreError(err instanceof Error ? err.message : 'Failed to load more activities');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (mood && location) {
      fetchItinerary(mood, page + 1);
    }
  };

  const handleReset = () => {
    setItineraryData(null);
    setMood(null);
    setLocation(null);
    setError(null);
  };

  useEffect(() => {
    if (itineraryData?.colorCode) {
      const event = new CustomEvent('colorChange', { detail: itineraryData.colorCode });
      window.dispatchEvent(event);
    }
  }, [itineraryData]);

  return (
    <>
      {!itineraryData && <AnimatedBackground />}
      {loading && <FullPageLoader message="Generating your personalized itinerary..." />}

      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          color: itineraryData ? theme.palette.text.primary : 'white',
          zIndex: 1,
          backgroundColor: itineraryData ? theme.palette.background.default : 'transparent',
        }}
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
            <Button
              color="inherit"
              startIcon={<EditLocationIcon />}
              onClick={() => setIsLocationModalOpen(true)}
            >
              {location || 'Set Location'}
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md">
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {location && !itineraryData && !loading && (
            <MoodSelector onMoodSelect={handleMoodSelect} loading={loading} />
          )}

          {itineraryData && (
            <Box sx={{ mt: 4 }}>
              <Itinerary activities={itineraryData.activities} />
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  {/* Activity Locations */}
                </Typography>
                <ActivityMap locations={itineraryData.activities.map((a) => a.location)} />
              </Box>
              {loadMoreError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {loadMoreError}
                </Alert>
              )}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  sx={{ mr: 2 }}
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
                <Button variant="contained" startIcon={<RefreshIcon />} onClick={handleReset}>
                  Start Over
                </Button>
              </Box>
            </Box>
          )}
        </Container>

        <LocationInput
          open={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          onLocationSubmit={handleLocationSubmit}
          currentLocation={location}
          isError={error}
        />
      </Box>
    </>
  );
}

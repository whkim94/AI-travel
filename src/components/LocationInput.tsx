import parse from 'autosuggest-highlight/parse';
import React, { useState, useEffect } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Grid,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
} from '@mui/material';

import constantTheme from 'src/theme/constantTheme';

interface LocationInputProps {
  open: boolean;
  onClose: () => void;
  onLocationSubmit: (location: string) => void;
  isError: string | null;
}

interface PlaceType {
  display_name: string;
  lat: string;
  lon: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: readonly { offset: number; length: number }[];
  };
}

const LocationInput: React.FC<LocationInputProps> = ({
  open,
  onClose,
  onLocationSubmit,
  isError,
}) => {
  const [value, setValue] = useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<readonly PlaceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(isError || null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const fetchSuggestions = async (input: string): Promise<PlaceType[]> => {
    if (input.length < 3) {
      return [];
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5`
      );
      const data = await response.json();
      return data.map((item: any) => ({
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
        structured_formatting: {
          main_text: item.display_name.split(',')[0],
          secondary_text: item.display_name.split(',').slice(1).join(','),
          main_text_matched_substrings: [{ offset: 0, length: input.length }],
        },
      }));
    } catch (err) {
      console.error('Error fetching location suggestions:', err);
      return [];
    }
  };

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return;
    }

    setLoading(true);

    const fetchData = async () => {
      const results = await fetchSuggestions(inputValue);
      if (active) {
        let newOptions: readonly PlaceType[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchData, 300);

    // eslint-disable-next-line consistent-return
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [value, inputValue]);

  useEffect(() => {
    getCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
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
              const newValue = {
                display_name: data.display_name,
                lat: data.lat,
                lon: data.lon,
                structured_formatting: {
                  main_text: data.display_name.split(',')[0],
                  secondary_text: data.display_name.split(',').slice(1).join(','),
                },
              };
              setValue(newValue);
              setInputValue(data.display_name);
              onLocationSubmit(data.display_name);
              onClose();
            }
          } catch (err) {
            console.error('Error fetching location name:', err);
            setError('Failed to get location. Please enter manually.');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to get your location. Please enter manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter location manually.');
    }
  };

  const handleSubmit = () => {
    if (value) {
      onLocationSubmit(value.display_name);
      onClose();
    }
  };

  return (
    <ThemeProvider theme={constantTheme}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth={!fullScreen}>
        <DialogTitle>Change Location</DialogTitle>
        <DialogContent>
          <Autocomplete
            id="location-autocomplete"
            sx={{ width: '100%', mt: 2 }}
            getOptionLabel={(option) => (typeof option === 'string' ? option : option.display_name)}
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            noOptionsText="No locations"
            onChange={(event: any, newValue: PlaceType | null) => {
              setOptions(newValue ? [newValue, ...options] : options);
              setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField {...params} margin="dense" label="Add a location" fullWidth />
            )}
            renderOption={(props, option) => {
              const matches = option.structured_formatting.main_text_matched_substrings || [];

              const parts = parse(
                option.structured_formatting.main_text,
                matches.map((match: any) => [match.offset, match.offset + match.length])
              );

              return (
                <li {...props}>
                  <Grid container alignItems="center">
                    <Grid item sx={{ display: 'flex', width: 44 }}>
                      <LocationOnIcon sx={{ color: 'text.secondary' }} />
                    </Grid>
                    <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                      {parts.map((part, index) => (
                        <Box
                          key={index}
                          component="span"
                          sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                        >
                          {part.text}
                        </Box>
                      ))}
                      <Typography variant="body2" color="text.secondary">
                        {option.structured_formatting.secondary_text}
                      </Typography>
                    </Grid>
                  </Grid>
                </li>
              );
            }}
            loading={loading}
          />
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={getCurrentLocation}
            disabled={loading}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!value || loading}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default LocationInput;

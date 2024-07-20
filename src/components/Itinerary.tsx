import React from 'react';
import Image from 'next/image';

import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {
  Box,
  Card,
  Grid,
  Paper,
  useTheme,
  CardMedia,
  Typography,
  CardContent,
} from '@mui/material';

import { getContrastColor } from 'src/utils/colorUtils';

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

interface ItineraryProps {
  activities: ItineraryActivity[];
}

function ActivityDetail({ activity }: { activity: ItineraryActivity }) {
  const theme = useTheme();
  const backgroundColor = theme.palette.background.paper;
  const iconColor = getContrastColor(backgroundColor);

  return (
    <Card sx={{ mb: 3 }}>
      <CardMedia component="div" sx={{ position: 'relative', height: 500 }}>
        <Image src={activity.imageUrl} alt={activity.title} layout="fill" objectFit="cover" />
      </CardMedia>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {activity.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {activity.activity}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <LocationOnIcon sx={{ mr: 1, color: iconColor }} />
              <Typography variant="body2">
                {activity.location.name}, {activity.location.address}
              </Typography>
            </Box>
          </Grid>
          {activity.additionalInfo.cost && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <AttachMoneyIcon sx={{ mr: 1, color: iconColor }} />
                <Typography variant="body2">Cost: {activity.additionalInfo.cost}</Typography>
              </Box>
            </Grid>
          )}
          {activity.additionalInfo.duration && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon sx={{ mr: 1, color: iconColor }} />
                <Typography variant="body2">
                  Duration: {activity.additionalInfo.duration}
                </Typography>
              </Box>
            </Grid>
          )}
          {activity.additionalInfo.tips && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="flex-start">
                <LightbulbIcon sx={{ mr: 1, mt: 0.5, color: iconColor }} />
                <Typography variant="body2">Tip: {activity.additionalInfo.tips}</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default function Itinerary({ activities }: ItineraryProps) {
  return (
    <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Your Personalized Itinerary
      </Typography>
      {activities.map((activity, index) => (
        <ActivityDetail key={index} activity={activity} />
      ))}
    </Paper>
  );
}

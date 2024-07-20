import React from 'react';
import Image from 'next/image';

import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { Box, Card, Grid, Link, Paper, CardMedia, Typography, CardContent } from '@mui/material';

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

function getGoogleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function ActivityCard({ activity }: { activity: ItineraryActivity }) {
  const mapUrl = getGoogleMapsUrl(`${activity.location.name}, ${activity.location.address}`);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia component="div" sx={{ position: 'relative', height: 200 }}>
        <Image src={activity.imageUrl} alt={activity.title} layout="fill" objectFit="cover" />
      </CardMedia>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {activity.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {activity.activity}
        </Typography>
        <Box display="flex" alignItems="flex-start" mb={1}>
          <LocationOnIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
          <Link
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            <Typography variant="body2">
              {activity.location.name}, {activity.location.address}
            </Typography>
          </Link>
        </Box>
        {activity.additionalInfo.cost && (
          <Box display="flex" alignItems="center" mb={1}>
            <AttachMoneyIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">Cost: {activity.additionalInfo.cost}</Typography>
          </Box>
        )}
        {activity.additionalInfo.duration && (
          <Box display="flex" alignItems="center" mb={1}>
            <AccessTimeIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2">Duration: {activity.additionalInfo.duration}</Typography>
          </Box>
        )}
        {activity.additionalInfo.tips && (
          <Box display="flex" alignItems="flex-start">
            <LightbulbIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
            <Typography variant="body2">Tip: {activity.additionalInfo.tips}</Typography>
          </Box>
        )}
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
      <Grid container spacing={3}>
        {activities.map((activity, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <ActivityCard activity={activity} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

import Image from 'next/image';
import React, { useState } from 'react';

import {
  List,
  Card,
  Paper,
  ListItem,
  CardMedia,
  Typography,
  CardContent,
  ListItemText,
} from '@mui/material';

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
  const [imgSrc, setImgSrc] = useState(activity.imageUrl);

  return (
    <Card sx={{ mb: 3 }}>
      <CardMedia component="div" sx={{ position: 'relative', height: 200 }}>
        <Image
          src={imgSrc}
          alt={activity.title}
          layout="fill"
          objectFit="cover"
          onError={() => setImgSrc('/placeholder-image.jpg')}
        />
      </CardMedia>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {activity.title}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {activity.activity}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Location: {activity.location.name}
        </Typography>
        <Typography variant="body2" gutterBottom>
          Address: {activity.location.address}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Additional Information:
        </Typography>
        <List dense>
          {Object.entries(activity.additionalInfo).map(([key, value]) => (
            <ListItem key={key}>
              <ListItemText primary={`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`} />
            </ListItem>
          ))}
        </List>
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
      {activities.map((item, index) => (
        <ActivityDetail key={index} activity={item} />
      ))}
    </Paper>
  );
}

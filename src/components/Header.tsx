import React from 'react';

import { Mood as MoodIcon } from '@mui/icons-material';
import { AppBar, Toolbar, Container, Typography } from '@mui/material';

const Header: React.FC = () => (
  <AppBar position="static" color="transparent" elevation={0}>
    <Container maxWidth={false} sx={{ m: 2 }}>
      <Toolbar disableGutters>
        <MoodIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          MoodTrek
        </Typography>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Header;

import React from 'react';

import { Mood as MoodIcon } from '@mui/icons-material';
import { AppBar, Toolbar, Container, Typography } from '@mui/material';

const Header: React.FC = () => (
  <AppBar position="static" color="primary">
    <Container maxWidth="xl">
      <Toolbar disableGutters>
        <MoodIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
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

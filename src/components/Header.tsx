import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Mood as MoodIcon } from '@mui/icons-material';

const Header: React.FC = () => {
  return (
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
};

export default Header;

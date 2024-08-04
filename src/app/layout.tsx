import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { Box, Link, Typography } from '@mui/material';

import { ThemeProvider } from 'src/theme/theme-provider';

import Header from 'src/components/Header';

export const metadata: Metadata = {
  title: 'MoodTrek',
  description: 'Your mood-based travel advisor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption">
              Location data ©{' '}
              <Link
                color="inherit"
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
              >
                OpenStreetMap contributors
              </Link>
            </Typography>
          </Box>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

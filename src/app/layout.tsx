import { Box, Link, Typography } from '@mui/material';

import { ThemeProvider } from 'src/theme/theme-provider';

import Header from 'src/components/Header';

export const metadata = {
  title: 'MoodTrek - Your Mood-Based Travel Advisor',
  description: 'Get personalized travel suggestions based on your mood',
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
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
              >
                OpenStreetMap contributors
              </Link>
            </Typography>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}

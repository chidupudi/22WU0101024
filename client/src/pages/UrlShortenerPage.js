import React from 'react';
import { Typography, Box } from '@mui/material';

function UrlShortenerPage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>
      <Typography>
        Create up to 5 shortened URLs here...
      </Typography>
    </Box>
  );
}

export default UrlShortenerPage;
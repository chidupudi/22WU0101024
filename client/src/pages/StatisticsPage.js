import React from 'react';
import { Typography, Box } from '@mui/material';

function StatisticsPage() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Statistics
      </Typography>
      <Typography>
        View your URL statistics here...
      </Typography>
    </Box>
  );
}

export default StatisticsPage;
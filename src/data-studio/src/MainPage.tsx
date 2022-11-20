import { Box } from '@mui/material';
import ForceGraphPage from './pages/ForceGraphPage';
import React from 'react';
import { useViews } from './views';
import JSONDatasetPage from './pages/JSONDatasetPage';


const MainPage: React.FC = () => {
  // use the current View
  const { current } = useViews()
  
  return (
    <Box>

      { current === 'ForceGraph' ? <ForceGraphPage /> : null }
      { current === 'JSON' ? <JSONDatasetPage /> : null }
    
    </Box>
  );
}

export default MainPage;

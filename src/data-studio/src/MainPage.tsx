import { Box } from '@mui/material';
import ForceGraphPage from './pages/ForceGraphPage';
import React from 'react';
import { useViews } from './views';
import JSONDatasetPage from './pages/JSONDatasetPage';
import TableViewPage from './pages/TableViewPage';
import ArrayViewPage from './pages/ArrayViewPage';


const MainPage: React.FC = () => {
  // use the current View
  const { current } = useViews()
  
  return (
    <Box>

      { current === 'ForceGraph' ? <ForceGraphPage /> : null }
      { current === 'JSON' ? <JSONDatasetPage /> : null }
      { current === 'Record' ? <TableViewPage /> : null}
      { current === 'Array' ? <ArrayViewPage /> : null }
    
    </Box>
  );
}

export default MainPage;

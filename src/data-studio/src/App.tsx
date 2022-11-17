import React, { useEffect, useState } from 'react';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { Data, Dataset, GraphDataset } from './Data.model';
import ForceGraphPage from './pages/ForceGraphPage';

const data: Data = require('./data.json')

function App() {
  // component state
  const [currentPage, setPage] = useState<string>('');
  const [currentData, setData] = useState<Dataset>();

  // check the datasets
  useEffect(() => {
    if (data.datasets.length > 0) {
      // TODO: sort the datasets into different kinds here and create the dropdowns

      // set the first dataset as default
      const dataset =  data.datasets[0]
      setPage(dataset.type)
      setData(dataset)
    } else {
      console.log('No data')
    }
  }, [])

  let page: any;
  if (currentPage === 'ForceGraph' && currentData) {
    page = <ForceGraphPage graphData={currentData as GraphDataset} />
  }

  return (
    <Box>
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar color="primary">
            <IconButton size="large" edge="start" color="inherit" sx={{mr: 2}}>
              <Menu />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              Data Studio
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>

      { page }
    
    </Box>
  );
}

export default App;

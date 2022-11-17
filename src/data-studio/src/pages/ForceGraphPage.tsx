import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, Toolbar, Typography } from "@mui/material";
import { Menu as MenuIcon } from '@mui/icons-material';
import { ForceGraph2D } from "react-force-graph";
import DataViewDropdown from "../components/DataViewDropdown";
import { GraphDataset } from "../Data.model";
import { useDatasets } from "../datasets";
import { useState } from "react";

const ForceGraphPage: React.FC = () => {
    // component state
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

    // load graph data
    const { forceGraphs } = useDatasets()
    
    let graphData: GraphDataset;
    if (forceGraphs.length === 1) {
        graphData = forceGraphs[0]
    } else if (forceGraphs.length === 0) {
        return <h1>No force-directed Graph data found</h1>
    } else {
        graphData = forceGraphs[0]
    }

    return <>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar color="primary">
                    <IconButton size="large" edge="start" color="inherit" sx={{mr: 2}} onClick={() => setDrawerOpen(!drawerOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Force Directed Graph - { graphData.title }
                    </Typography>
                    <DataViewDropdown />
                </Toolbar>
            </AppBar>
        </Box>
            
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
            <Toolbar />
            <Divider />
            <List>
                <ListItem>Peter</ListItem>
                <ListItem>Lustig</ListItem>
            </List>
        </Drawer>

        <ForceGraph2D
            width={window.innerWidth}
            height={window.innerHeight - 64}
            graphData={graphData.data} 
        />
    </>
}

export default ForceGraphPage;
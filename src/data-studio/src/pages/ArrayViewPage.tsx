import { AppBar, Box, Grid, List, ListItem, ListItemButton, ListSubheader, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import DataViewDropdown from "../components/DataViewDropdown";
import { ArrayDataset } from "../Data.model";
import { useDatasets } from "../datasets";

const ArrayViewPage: React.FC = () => {
    // load the arrays
    const { arrays } = useDatasets()
    
    // component state
    const[current, setCurrent] = useState<ArrayDataset>()
    const[view, setView] = useState<'pre' | 'graph'>('pre')

    return <>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar color="primary">
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Array view - {current ? current.title : 'no array selected'}
                    </Typography>
                    <DataViewDropdown />
                </Toolbar>
            </AppBar>
        </Box>

        <Box sx={{flexGrow: 1}}>
            <Grid container>

                <Grid xs={3}>
                    <ToggleButtonGroup color="primary" value={view} onChange={(e, v) => {setView(v)}} exclusive>
                        <ToggleButton value="pre">PRE</ToggleButton>
                        <ToggleButton value="graph">GRAPH</ToggleButton>
                    </ToggleButtonGroup>
                    <List sx={{p: 1}}>
                        <ListSubheader>Array datasets</ListSubheader>
                        { arrays.map(arr => (
                            <ListItem key={arr.title} onClick={() => setCurrent(arr)}>
                                <ListItemButton>
                                    { arr.title }
                                </ListItemButton>
                            </ListItem>
                        )) }
                    </List>
                </Grid>

                <Grid xs={9} sx={{p: 2}}>

                </Grid>

            </Grid>
        </Box>
    </>
}

export default ArrayViewPage;
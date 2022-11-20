import { useState } from "react"
import { AppBar, Box, List, ListItem, ListItemButton, ListSubheader, Paper, Toolbar, Typography } from "@mui/material"
import Grid from '@mui/material/Unstable_Grid2'
import { JsonViewer } from '@textea/json-viewer';
import DataViewDropdown from "../components/DataViewDropdown"
import { JSONDataset } from "../Data.model"
import { useDatasets } from "../datasets"

const JSONDatasetPage: React.FC = () => {
    // get the generic JSON data from the context
    const { genericJson } = useDatasets()

    // component state
    const [current, setCurrent] = useState<JSONDataset>()

    // return the page
    return <>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar color="primary">
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        JSON viewer - {current ? current.title : 'no data selected'}
                    </Typography>
                    <DataViewDropdown />
                </Toolbar>
            </AppBar>
        </Box>

        <Box sx={{flexGrow: 1}}>
            <Grid container spacing={1}>

                <Grid xs={3}>
                    <List>
                        <ListSubheader>generic JSON datasets</ListSubheader>
                        { genericJson.map(js => (
                            <ListItem key={js.title} onClick={() => setCurrent(js)}>
                                <ListItemButton>
                                    {js.title}
                                </ListItemButton>
                            </ListItem>
                        )) }
                    </List>
                </Grid>

                <Grid xs={9}>
                    <Paper elevation={3} sx={{p: 1, height: 'calc(100vh - 90px)', overflowY: 'scroll'}}>
                        { current ? <JsonViewer  value={current.data} />
                            : (
                                <i>Please select a dataset first</i>
                            )
                        }
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    </>
}

export default JSONDatasetPage
import { AppBar, Box, Divider, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Select, Switch, Toolbar, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { Menu as MenuIcon } from '@mui/icons-material';
import { ForceGraph2D } from "react-force-graph";
import DataViewDropdown from "../components/DataViewDropdown";
import { GraphDataset } from "../Data.model";
import { useDatasets } from "../datasets";
import { useEffect, useState } from "react";


const ForceGraphPage: React.FC = () => {
    // component state
    const [graphData, setGraphData] = useState<GraphDataset>()


    // states to control the graph itself
    const [curvature, setCurvature] = useState<boolean>(false)
    const [linkOptions, setLinkOptions] = useState<string[]>([])
    const [linkColor, setLinkColor] = useState<string | null>(null)

    // load graph data
    const { forceGraphs } = useDatasets()

    // set graph data
    useEffect(() => {
        if (forceGraphs.length > 0) {
            setGraphData(forceGraphs[0])
        }
    }, [forceGraphs])

    // derive linkColorOptions
    useEffect(() => {
        // use only the fist occurence
        const firstLink = graphData?.data.links[0]
        if (firstLink) {
            const opts = Object.keys(firstLink).filter(k => !['source', 'target'].includes(k)).filter(l => !l.startsWith('_'))
            setLinkOptions(opts)
        }
    }, [graphData])

    // whenever the link options change, reset the autocolor
    useEffect(() => {
        if (linkColor && !linkOptions.includes(linkColor)) {
            setLinkColor(null)
        } 
    }, [linkOptions])


    // header
    const Header = (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar color="primary">
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Force Directed Graph - { graphData ? graphData.title : 'no data' }
                    </Typography>
                    <DataViewDropdown />
                </Toolbar>
            </AppBar>
        </Box>
    )
    
    if (!graphData) {
        return <>
            { Header }
            <h1>No Graph data available</h1>
        </>
    }
    return <>
        { Header }
        <Box sx={{flexGrow: 1}}>

        <Grid container spacing="2">

            <Grid xs={3}>
                <List>
                    <ListSubheader>Data</ListSubheader>
                    
                    <ListItem>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="data-select">Dataset</InputLabel>
                            <Select labelId="data-select" value={graphData.title} onChange={e => setGraphData(forceGraphs.find(d => d.title===e.target.value as string))}>
                                { forceGraphs.map(d => <MenuItem key={d.title} value={d.title}>{d.title}</MenuItem>) }
                            </Select>
                        </FormControl>
                    </ListItem>


                    <Divider />
                    <ListSubheader>Visuals</ListSubheader>
                    
                    <ListItem>
                        <FormControl variant="standard" fullWidth>
                            <InputLabel id="link-color">Link Color by</InputLabel>
                            <Select labelId="link-color" value={linkColor} onChange={e => setLinkColor(e.target.value !== 'null' ? e.target.value : null )}>
                                <MenuItem value={'null'}>no color</MenuItem>
                                { linkOptions.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>) }
                            </Select>
                        </FormControl>
                    </ListItem>

                    <ListItem>
                        <FormGroup>
                            <FormControlLabel control={<Switch defaultChecked={false} onChange={e => setCurvature(e.target.checked)} />} label="Curved" />
                        </FormGroup>
                    </ListItem>

                </List>
            </Grid>

            <Grid xs={9} sx={{p: 1}}>
                <Paper elevation={3}>
                <ForceGraph2D
                    width={0.73 * window.innerWidth}
                    height={window.innerHeight - 80}
                    
                    linkCurvature={curvature ? 0.35 : 0}
                    linkAutoColorBy={linkColor}

                    graphData={graphData.data} 
                />
                </Paper>

            </Grid>

        </Grid>

        </Box>

    </>
}

export default ForceGraphPage;
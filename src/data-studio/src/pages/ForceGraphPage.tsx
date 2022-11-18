import React, { useEffect, useState } from "react";
import { AppBar, Box, Divider, FormControl, FormControlLabel,  InputLabel, List, ListItem, ListSubheader, MenuItem, Paper, Select, SelectChangeEvent, Slider, Switch, Toolbar, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { ForceGraph2D } from "react-force-graph";
import { scale } from 'chroma-js';

import DataViewDropdown from "../components/DataViewDropdown";
import { ForceLink, ForceNode, GraphDataset } from "../Data.model";
import { useDatasets } from "../datasets";


const ForceGraphPage: React.FC = () => {
    // component state
    const [graphData, setGraphData] = useState<GraphDataset>()
    const [nodes, setNodes] = useState<ForceNode[]>([])
    const [links, setLinks] = useState<ForceLink[]>([])


    // states to control the graph itself
    const [curvature, setCurvature] = useState<boolean>(false)
    const [directed, setDirected] = useState<boolean>(true)
    const [linkOptions, setLinkOptions] = useState<string[]>([])
    const [nodesOptions, setNodeOptions] = useState<string[]>([])

    // visuals of the graph
    const [linkColor, setLinkColor] = useState<string | null>(null)
    const [nodeSize, setNodeSize] = useState<string | null>(null)
    const [filter, setFilter] = useState<{[key: string]: number[]}>({})

    // load graph data
    const { forceGraphs } = useDatasets()

    // set graph data
    useEffect(() => {
        if (forceGraphs.length > 0) {
            setGraphData(forceGraphs[0])
        }
    }, [forceGraphs])
    useEffect(() => {
        if (graphData) {
            setNodes([...graphData.data.nodes])
            setLinks([...graphData.data.links])
        }
    },[graphData])

    // derive linkColorOptions
    useEffect(() => {
        // use only the fist occurence
        const firstLink = graphData?.data.links[0]
        if (firstLink) {
            const opts = Object.keys(firstLink).filter(k => !['source', 'target', 'index', 'color'].includes(k)).filter(l => !l.startsWith('_'))
            setLinkOptions(opts)
            
        }

        // do the same for the nodes
        const firstNode = graphData?.data.nodes[0]
        if (firstNode) {
            const opts = Object.keys(firstNode).filter(n => !['id', 'index', 'x', 'y', 'vx', 'vy', 'fx', 'fy', 'value'].includes(n) && !n.startsWith('_'))
            setNodeOptions(opts)
        }
    }, [graphData])

    // whenever the link options change, reset the auto options
    useEffect(() => {
        if (linkColor && !linkOptions.includes(linkColor)) {
            setLinkColor(null)
        } 
    }, [linkOptions, linkColor])

    // whenever the node options change, reset the auto-options
    useEffect(() => {
        if (nodeSize && !nodesOptions.includes(nodeSize)) {
            setNodeSize(null)
        }
    }, [nodeSize, nodesOptions])

    // color handler
    const onColorChange = (event: SelectChangeEvent<string>) => {
        if (event.target.value === 'null') {
            setLinkColor(null)
        } else {
            setLinkColor(event.target.value)
        }
    }

    // add colors to the links
    // TODO: the scale can be turn into state as well
    useEffect(() => {
        // get min and max
        if (linkColor) {
            const vals = links.map(l => l[linkColor] as number)
            const colorScaler = scale(['red', 'yellow', 'blue']).domain([Math.min(...vals), Math.max(...vals)])
            links.forEach((l, i) => {
                l.color = colorScaler(i).hex()
            })
        } else {
            links.forEach(l => {
                l.color = 'lightblue'
            })
        }
    })

    // add the nodeSize to the nodes
    useEffect(() => {
        nodes.forEach(n => {
            n.value = nodeSize ? n[nodeSize] : 2
        })
    })
    

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
                    <Box>
                        <ListSubheader>Data</ListSubheader>
                        
                        <ListItem>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="data-select">Dataset</InputLabel>
                                <Select labelId="data-select" value={graphData.title} onChange={e => setGraphData(forceGraphs.find(d => d.title===e.target.value as string))}>
                                    { forceGraphs.map(d => <MenuItem key={d.title} value={d.title}>{d.title}</MenuItem>) }
                                </Select>
                            </FormControl>
                        </ListItem>
                        <Divider sx={{my: 1}}/>
                    </Box>

                    <Box>
                        <ListSubheader>Filter</ListSubheader>
                        { linkOptions.map(opt => {
                            return (
                                <FormControl variant="standard" fullWidth sx={{m: 1}}>
                                    <InputLabel id={`filt-${opt}`}>Filter: {opt}</InputLabel>
                                    <Slider key={opt} sx={{ml: 3, width: '80%'}} value={[0, 100]} max={120} valueLabelDisplay="auto" />
                                </FormControl>
                                
                            )
                        })}

                        <Divider sx={{mt: 2}} />
                    </Box>

                    <Box>
                        <ListSubheader>Visuals</ListSubheader>
                        
                        <ListItem>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="node-size">Size Nodes by</InputLabel>
                                <Select labelId="node-size" value={nodeSize ? nodeSize : 'null'} onChange={e => e.target.value !== 'null' ? setNodeSize(e.target.value) : setNodeSize(null)}>
                                    <MenuItem value="null">same size</MenuItem>
                                    { nodesOptions.map(n => <MenuItem key={n} value={n}>{n}</MenuItem>) }
                                </Select>
                            </FormControl>
                        </ListItem>

                        <ListItem>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="link-color">Link Color by</InputLabel>
                                <Select labelId="link-color" value={linkColor === null ? 'null' : linkColor} onChange={onColorChange}>
                                    <MenuItem value={'null'}>no color</MenuItem>
                                    { linkOptions.map(l => <MenuItem key={l} value={l}>{l}</MenuItem>) }
                                </Select>
                            </FormControl>
                        </ListItem>

                        <ListItem>
                            <FormControl variant="standard">
                                <FormControlLabel control={<Switch defaultChecked={false} onChange={e => setCurvature(e.target.checked)} />} label="Curved" />
                            </FormControl>
                        </ListItem>

                        <ListItem>
                            <FormControl variant="standard">
                                <FormControlLabel control={<Switch defaultChecked onChange={e => setDirected(e.target.checked)} />} label="Directed graph"/>
                            </FormControl>
                        </ListItem>
                        <Divider />
                    </Box>

                </List>
            </Grid>

            <Grid xs={9} sx={{p: 1}}>
                <Paper elevation={3}>
                <ForceGraph2D
                    width={0.73 * window.innerWidth}
                    height={window.innerHeight - 80}

                    nodeVal="value"
                    
                    linkCurvature={curvature ? 0.35 : 0}
                    linkDirectionalArrowLength={directed ? 3.5 : 0}
                    linkDirectionalArrowRelPos={1}

                    graphData={{nodes, links}}
                    
                />
                </Paper>

            </Grid>

        </Grid>

        </Box>

    </>
}

export default ForceGraphPage;
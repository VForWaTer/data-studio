import React, { useEffect, useState } from "react";
import { AppBar, Box, Divider, FormControl, FormControlLabel,  IconButton,  InputLabel, List, ListItem, ListSubheader, MenuItem, Paper, Select, SelectChangeEvent, Slider, Switch, Toolbar, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { Upload } from '@mui/icons-material';
import { ForceGraph2D } from "react-force-graph";
import { scale } from 'chroma-js';
import cloneDeep from 'lodash.clonedeep';

import DataViewDropdown from "../components/DataViewDropdown";
import { ForceLink, ForceNode, GraphDataset, JSONDataset, RecordDataset } from "../Data.model";
import { useDatasets } from "../datasets";

interface LinkFilter {
    [key: string]: {min: number, max: number, value: number[]}
}

const ForceGraphPage: React.FC = () => {
    // component state
    const [graphData, setGraphData] = useState<GraphDataset>()
    const [nodes, setNodes] = useState<ForceNode[]>([])
    const [links, setLinks] = useState<ForceLink[]>([])
    const [filteredLinks, setFilteredLinks] = useState<ForceLink[]>([])


    // states to control the graph itself
    const [curvature, setCurvature] = useState<boolean>(false)
    const [directed, setDirected] = useState<boolean>(true)
    const [linkOptions, setLinkOptions] = useState<string[]>([])
    const [nodesOptions, setNodeOptions] = useState<string[]>([])

    // visuals of the graph
    const [linkColor, setLinkColor] = useState<string | null>(null)
    const [nodeSize, setNodeSize] = useState<string | null>(null)
    const [filter, setFilter] = useState<LinkFilter>({})

    // load graph data
    const { forceGraphs, appendDatasets } = useDatasets()

    // set graph data
    useEffect(() => {
        if (forceGraphs.length > 0) {
            setGraphData(cloneDeep(forceGraphs[0]))
        }
    }, [forceGraphs])
    useEffect(() => {
        if (graphData) {
            setNodes(cloneDeep(graphData.data.nodes))
            setLinks(cloneDeep(graphData.data.links))
        }
    },[graphData])

    // populate the filter options whenever linksOptions change
    useEffect(() => {
        const filt: LinkFilter = {}
        linkOptions.forEach(opt => {
            const vals = links.map(l => l[opt])
            filt[opt] = {min: Math.min(...vals), max: Math.max(...vals), value: [Math.min(...vals), Math.max(...vals)]}
        })
        setFilter(filt)
    }, [linkOptions, links])

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

    // update the slider when a user
    const updateFilter = (key: string, value: number[]) => {
        const filt = cloneDeep(filter)
        filt[key] = {...filt[key], value: value}
        setFilter(filt)
    }
    
    // update the filtered Links whenever the filter changes
    useEffect(() => {
        const filtLinks = links.filter(link => {
            return Object.entries(filter).every(([key, filt]) => {
                return link[key] >= filt.value[0] && link[key] <= filt.value[1]
            })
        })
        setFilteredLinks(filtLinks)
    }, [links, filter])

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
        // copy the filtered links
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

    // add the current graph to the dataset context
    const addToContext = () => {
        // add as generic json
        const jsonSet = {title: graphData?.title, type: 'JSON', data: { nodes, links: cloneDeep(filteredLinks) }} as JSONDataset
        
        // also add as records
        const nodesRecord = {title: `Nodes of ${graphData?.title}`, type: 'Record', data: cloneDeep(nodes)} as RecordDataset
        const linksRecord = {title: `Links of ${graphData?.title}`, type: 'Record', data: cloneDeep(filteredLinks)} as RecordDataset

        // append stuff
        appendDatasets([jsonSet, nodesRecord, linksRecord])
    }
    
    // header
    const Header = (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar color="primary">
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Force Directed Graph - { graphData ? graphData.title : 'no data' }
                    </Typography>
                    <IconButton color="inherit" onClick={() => addToContext()}><Upload /></IconButton>
                    <DataViewDropdown />
                </Toolbar>
            </AppBar>
        </Box>
    );
    
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
                        { Object.keys(filter).length === 0 ? null : linkOptions.map(opt => {
                            return (
                                <FormControl key={opt} variant="standard" fullWidth sx={{m: 1, zIndex: 10}}>
                                    <InputLabel id={`filt-${opt}`} sx={{mt: 1}}>Filter: {opt}</InputLabel>
                                    <Slider  
                                        sx={{ml: 3, width: '80%'}} 
                                        value={filter[opt].value} 
                                        max={filter[opt].max} 
                                        min={filter[opt].min}
                                        onChange={(e, vals) => updateFilter(opt, vals as number[])}
                                        valueLabelDisplay="auto"
                                    />
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

                    graphData={{nodes, links: filteredLinks}}
                    
                />
                </Paper>

            </Grid>

        </Grid>

        </Box>

    </>
}

export default ForceGraphPage;
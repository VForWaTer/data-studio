import { AppBar, Box, Button, Grid, List, ListItem, ListItemButton, ListSubheader, Paper, Toolbar, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import DataViewDropdown from "../components/DataViewDropdown"
import { RecordDataset } from "../Data.model"
import { useDatasets } from "../datasets"
import { idID } from "@mui/material/locale";

const TableView: React.FC = () => {
    // get the record datatypes from the context
    const { records } = useDatasets()

    // component state
    const [current, setCurrent] = useState<RecordDataset>()
    const [columns, setColumns] = useState<GridColDef[]>([])
    const [rows, setRows] = useState<any[]>([])

    useEffect(() => {
        //  first get all unique column naems
        const colNames: string[] = []
        current?.data.forEach(rec => {
            Object.keys(rec).forEach(key => {
                if (!colNames.includes(key)) {
                    colNames.push(key)
                }
            })
        })

        // map to colDefs
        const colDefs = [
            {field: 'id', headerName: 'Row index'} as GridColDef,
            ...colNames.map(name => {
                return {field: name, headerName: name.toUpperCase()} as GridColDef
            })
        ]

        // set column definitions
        setColumns(colDefs)

        // build rows
        const newRows: any[] = []
        current?.data.forEach((rec, i) => newRows.push({id: i, ...rec}))
        setRows(newRows)
    }, [current])


    return <>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar color="primary">
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Data Table - {current ? current.title : 'no data selected'}
                    </Typography>
                    <DataViewDropdown />
                </Toolbar>
            </AppBar>
        </Box>

        <Box sx={{flexGrow: 1}}>
            <Grid container>
                
                <Grid xs={3}>
                    <List sx={{p: 1}}>
                        <ListSubheader>Actions</ListSubheader>
                            <ListItem>
                                <Button color="success" fullWidth variant="contained" disabled={!current}>save as CSV</Button>
                            </ListItem>

                        <ListSubheader>datasets</ListSubheader>
                        { records.map(rec => (
                            <ListItem key={rec.title} onClick={() => setCurrent(rec)}>
                                <ListItemButton>
                                    { rec.title }
                                </ListItemButton>
                            </ListItem>
                        )) }
                    </List>
                </Grid>

                <Grid xs={9} sx={{p: 2}}>
                    {/* <Paper elevation={3} sx={{p: 1, height: 'calc(100vh - 90px)'}}> */}
                        <DataGrid 
                            rows={rows}
                            columns={columns}
                            pageSize={25}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            disableSelectionOnClick
                        />
                    {/* </Paper> */}
                </Grid>
            </Grid>
        </Box>
    </>
}

export default TableView
import { Button, ButtonProps, Menu, MenuItem } from "@mui/material";
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import React, { useState } from "react";
import { DATASET_TYPE } from "../Data.model";
import { useDatasets } from "../datasets";
import { useViews } from "../views";


type DataViewDropdownProps = Exclude<ButtonProps, 'onClick' | 'disabled' | 'endIcon'> 


const DataViewDropdown: React.FC<DataViewDropdownProps> = ({ ...props }) => {
    // achor element
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    // load the datatypes
    const { dataTypes } = useDatasets()

    // use the views context
    const { current, setCurrent } = useViews()
    
    const close = () => {
        setAnchorEl(null)
    }

    const open = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget)
    }

    const onClick = (view: DATASET_TYPE) => {
        setCurrent(view)
        close()
    }

    // set some defaults
    if (!props.color) props.color = 'inherit'
    if (!props.variant) props.variant = 'text'

    return <>
        <Button 
            disabled={dataTypes.length === 0} 
            onClick={open}
            endIcon={anchorEl ? <ExpandLess /> : <ExpandMore />}
            {...props}
        >
            Data Views
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={close}>
            { dataTypes.map(dtype => <MenuItem key={dtype} onClick={() => onClick(dtype)} disabled={current===dtype}>{ dtype }</MenuItem>) }
        </Menu>
    </>
}

export default DataViewDropdown;

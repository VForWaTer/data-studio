import React, { createContext, useContext, useEffect, useState } from "react";
import { DATASET_TYPE } from "./Data.model";
import { useDatasets } from "./datasets";

interface ViewsState {
    current: DATASET_TYPE | undefined;
    setCurrent: (view: DATASET_TYPE) => void;
}

const initialState: ViewsState = {
    current: undefined,
    setCurrent: (view: DATASET_TYPE) => {}
}

const ViewsContext = createContext(initialState);

export const ViewsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // state
    const [current, setCurrent] = useState<DATASET_TYPE>()

    // get the available types
    const { dataTypes } = useDatasets()

    // set default
    useEffect(() => {
        if (!current && dataTypes.length > 0) {
            setCurrent(dataTypes[0])
        }
    }, [dataTypes, current])  

    // build the value
    const value = {current, setCurrent }

    return <>
        <ViewsContext.Provider value={value}>
            { children }
        </ViewsContext.Provider>
    </>
}

export const useViews = () => useContext(ViewsContext)

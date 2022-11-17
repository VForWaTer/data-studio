import { createContext, useContext, useEffect, useState } from "react"
import { Dataset, DATASET_TYPE, GraphDataset } from "./Data.model"

interface DatasetsState {
    datasets: Dataset[],
    dataTypes: DATASET_TYPE[],
    forceGraphs: GraphDataset[],
    setDatasets: (datasets: Dataset[]) => void
}

const initialState: DatasetsState = {
    datasets: [],
    dataTypes: [],
    forceGraphs: [],
    setDatasets: (datasets: Dataset[]) => {}
}

const DatasetContext = createContext(initialState)

export const DatasetProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // available types
    const [dataTypes, setDataTypes] = useState<DATASET_TYPE[]>([])
    
    // context datasets state
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [forceGraphs, setForceGraphs] = useState<GraphDataset[]>([])

    // create an effect to watch for changes on setDatasets
    useEffect(() => {
        // set existing dataTypes
        const dtypes = datasets.filter((v, i, arr) => arr.indexOf(v) === i).map(d => d.type)
        setDataTypes(dtypes)

        // filter for force datasets
        const newForce: GraphDataset[] = datasets.filter(d => d.type === 'ForceGraph').map(d => d as GraphDataset)
        setForceGraphs(newForce)
    }, [datasets])

    // create the current context values
    const  value = {
        datasets,
        dataTypes,
        forceGraphs,
        setDatasets
    }

    // return the Context provider
    return <>
        <DatasetContext.Provider value={value}>
            { children }
        </DatasetContext.Provider>
    </>
}

export const useDatasets = () => useContext(DatasetContext)


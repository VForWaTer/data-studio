import cloneDeep from "lodash.clonedeep"
import { createContext, useContext, useEffect, useState } from "react"
import { Dataset, DATASET_TYPE, GraphDataset, JSONDataset, RecordDataset } from "./Data.model"

interface DatasetsState {
    datasets: Dataset[],
    dataTypes: DATASET_TYPE[],
    forceGraphs: GraphDataset[],
    genericJson: JSONDataset[],
    records: RecordDataset[],
    setDatasets: (datasets: Dataset[]) => void,
    appendDatasets: (datasets: Dataset[]) => void
}

const initialState: DatasetsState = {
    datasets: [],
    dataTypes: [],
    forceGraphs: [],
    genericJson: [],
    records: [],
    setDatasets: (datasets: Dataset[]) => {},
    appendDatasets: (datasets: Dataset[]) => {}
}

const DatasetContext = createContext(initialState)

export const DatasetProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // available types
    const [dataTypes, setDataTypes] = useState<DATASET_TYPE[]>([])
    
    // context datasets state
    const [datasets, replaceDatasets] = useState<Dataset[]>([])
    const [forceGraphs, setForceGraphs] = useState<GraphDataset[]>([])
    const [records, setRecords] = useState<RecordDataset[]>([])
    const [genericJson, setGenericJson] = useState<JSONDataset[]>([])

    const setDatasets = (newDatasets: Dataset[]) => {
        replaceDatasets(cloneDeep(newDatasets))
    }

    const appendDatasets = (newDatasets: Dataset[]) => {
        // load all datasets which are not the same
        const sets = cloneDeep(newDatasets) 
        datasets.forEach(d => {
            if (sets.filter(s => s.title===d.title && d.type===s.type).length === 0) {
                sets.push(cloneDeep(d))
            }
        })
        console.log(sets)
        replaceDatasets(sets)
        console.log(datasets)
    }

    // create an effect to watch for changes on setDatasets
    useEffect(() => {
        // set existing dataTypes
        const dtypes = datasets.map(d => d.type).filter((v, i, arr) => arr.indexOf(v) === i)
        setDataTypes(dtypes)

        // filter for force datasets
        const newForce: GraphDataset[] = datasets.filter(d => d.type === 'ForceGraph').map(d => d as GraphDataset)
        setForceGraphs(newForce)

        // filter for json data
        const newJSON: JSONDataset[] = datasets.filter(d => d.type === 'JSON').map(d => d as JSONDataset)
        setGenericJson(newJSON)

        // filter records
        const newRecords: RecordDataset[] = datasets.filter(d => d.type === 'Record').map(d => d as RecordDataset)
        setRecords(newRecords)
    }, [datasets])

    // create the current context values
    const  value = {
        datasets,
        dataTypes,
        forceGraphs,
        genericJson,
        records,
        setDatasets,
        appendDatasets
    }

    // return the Context provider
    return <>
        <DatasetContext.Provider value={value}>
            { children }
        </DatasetContext.Provider>
    </>
}

export const useDatasets = () => useContext(DatasetContext)


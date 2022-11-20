// main Data object
export interface Data {
    datasets: Dataset[] 
}

export type DATASET_TYPE = 'ForceGraph' | 'Array' | 'JSON' | 'Record'; 

// basic Dataset
export interface Dataset {
    type: DATASET_TYPE,
    title: string,
}

// Record datasets
export interface RecordDataset extends Dataset {
    type: 'Record',
    data: {[key: string]: any}[]
}

// Array dataset
export interface ArrayDataset extends Dataset {
    type: 'Array'
    ndims?: number,
    data: number[] | number[][]
}

// generic json-data
export interface JSONDataset extends Dataset {
    type: 'JSON',
    data: any
}

// Force directed graph
export interface GraphDataset extends Dataset {
    type: 'ForceGraph',
    data: GraphData
}

// Graph Data
export interface GraphData {
    nodes: ForceNode[],
    links:ForceLink[]
}

export interface ForceNode {
    id: string | number
    [key: string]: any
}

export interface ForceLink {
    source: string | number
    target: string | number
    [key: string]: any
}
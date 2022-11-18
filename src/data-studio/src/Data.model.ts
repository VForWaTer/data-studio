// main Data object
export interface Data {
    datasets: Dataset[] 
}

export type DATASET_TYPE = 'ForceGraph' | 'Array'; 

// basic Dataset
export interface Dataset {
    type: DATASET_TYPE
    title: string,
}

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
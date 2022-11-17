// main Data object
export interface Data {
    datasets: Dataset[]
}

// basic Dataset
export interface Dataset {
    type: 'ForceGraph' | 'Array'
    title: string,
}

export interface GraphDataset extends Dataset {
    type: 'ForceGraph',
    data: GraphData
}

// Graph Data
export interface GraphData {
    nodes: {
        id: string | number
        [key: string]: any
    }[],
    links: {
        source: string | number
        target: string | number
        [key: string]: any
    }[]
}
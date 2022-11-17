import { ForceGraph2D } from "react-force-graph";
import { GraphDataset } from "../Data.model";

interface ForceGraphPageProps {
    graphData: GraphDataset
}

const ForceGraphPage: React.FC<ForceGraphPageProps> = ({ graphData }) => {
    return (
        <ForceGraph2D
            width={window.innerWidth}
            height={window.innerHeight - 64}
            graphData={graphData.data} 
        />
    )
}

export default ForceGraphPage;
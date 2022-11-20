import { useEffect } from "react";
import { Data } from "./Data.model";
import { useDatasets } from "./datasets";
import MainPage from "./MainPage"
import { ViewsProvider } from "./views";


// import the data here
const data: Data = require('./data.json')

const App: React.FC = () => {
    // before rendering, load the data to the application
    const { setDatasets } = useDatasets()
    
    useEffect(() => {
        setDatasets(data.datasets)
    }, [])

    return (
        <ViewsProvider>
            <MainPage />
        </ViewsProvider>
    )
}

export default App;
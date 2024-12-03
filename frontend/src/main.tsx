import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {store} from "store/store.ts";
import {PersistGate} from "redux-persist/integration/react"
import {persister} from "store/store.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter basename={"/frontend"}>
        <Provider store={store} >
            <PersistGate persistor={persister}>
                <App />
            </PersistGate>
        </Provider>
    </BrowserRouter>
)

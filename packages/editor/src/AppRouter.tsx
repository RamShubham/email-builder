import { BrowserRouter, Route, Routes } from 'react-router-dom';

import App from './App';
import AuthRoute from './AuthRoute';
import EmbedEditor from './EmbedEditor';
import Redirect from './Redirect';


function AppRouter() {
        return (
                <BrowserRouter>
                        <Routes>
                                <Route path="/template" element={<AuthRoute component={App} />} />
                                <Route path="/asset" element={<AuthRoute component={App} />} />
                                <Route path="/dev" element={<App />} />
                                <Route path="/embed" element={<EmbedEditor />} />
                                {/* <Route path="/" element={<App />} /> */}
                                <Route path="*" element={<Redirect url={process.env.REACT_APP_WC_LANDING_URL} />} />
                        </Routes>
                </BrowserRouter>
        );
}

export default AppRouter;

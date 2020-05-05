import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Application } from 'react-rainbow-components';
import AppRoutes from './routes';
import Layout from './components/layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import theme from './theme';

const applicationTheme = {
    rainbow: {
        palette: {
            brand: theme.colors.primary,
        },
    },
};

function App() {
    return (
        <Application theme={applicationTheme}>
            <BrowserRouter>
                <Layout>
                    <AppRoutes />
                </Layout>
            </BrowserRouter>
        </Application>
    );
}

export default App;

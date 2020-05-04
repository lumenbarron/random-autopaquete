import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/home';

const AppRoutes = () => {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Redirect to="/" />
        </Switch>
    );
};

export default AppRoutes;

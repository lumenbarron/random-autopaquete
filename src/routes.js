import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/home';

const AppRoutes = () => {
    return (
        <Switch>
            <Route exact path="/enviar" component={Home} />
            <Route exact path="/servicios" component={Home} />
            <Route exact path="/cotizacion" component={Home} />
            <Route exact path="/mi-cuenta" component={Home} />
            <Redirect to="/" />
        </Switch>
    );
};

export default AppRoutes;

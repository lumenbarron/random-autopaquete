import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './pages/home';
import QuotePage from './pages/quote';
import ServicesPage from './pages/services';
import SendPage from './pages/send';
import AccountPage from './pages/account';
import PrivacyPage from './pages/privacy';
import ConditionsPage from './pages/conditions';

const AppRoutes = () => {
    return (
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/enviar" component={SendPage} />
            <Route exact path="/servicios" component={ServicesPage} />
            <Route exact path="/cotizacion" component={QuotePage} />
            <Route exact path="/mi-cuenta" component={AccountPage} />
            <Route exact path="/aviso-de-privacidad" component={PrivacyPage} />
            <Route exact path="/terminos-y-condiciones" component={ConditionsPage} />

            <Redirect to="/" />
        </Switch>
    );
};

export default AppRoutes;

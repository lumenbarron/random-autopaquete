import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import HomePage from './pages/home';
import PrivacyPage from './pages/privacy';
import ContactPage from './pages/contact';
import QuotePage from './pages/quote';
import DirectionPage from './pages/direction';
import SendPage from './pages/send';
import RecordPage from './pages/record';
import AccountPage from './pages/account';
import ServicesPage from './pages/services';
import OverweightPage from './pages/overweight';
import ConditionsPage from './pages/conditions';

const AppRoutes = () => {
    return (
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/aviso-de-privacidad" component={PrivacyPage} />
            <Route exact path="/contacto" component={ContactPage} />
            <Route exact path="/cotizacion" component={QuotePage} />
            <Route exact path="/direcciones" component={DirectionPage} />
            <Route exact path="/enviar" component={SendPage} />
            <Route exact path="/historial" component={RecordPage} />
            <Route exact path="/mi-cuenta" component={AccountPage} />
            <Route exact path="/servicios" component={ServicesPage} />
            <Route exact path="/sobrepeso" component={OverweightPage} />
            <Route exact path="/terminos-y-condiciones" component={ConditionsPage} />

            <Redirect to="/" />
        </Switch>
    );
};

export default AppRoutes;

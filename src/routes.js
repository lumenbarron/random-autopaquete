import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import HomePage from './pages/home';
import PrivacyPage from './pages/privacy';
import AdminPage from './pages/admin';
import ContactPage from './pages/contact';
import QuotePage from './pages/quote';
import DirectionPage from './pages/direction';
import SendPage from './pages/send';
import RecordPage from './pages/record';
import AccountPage from './pages/account';
import ServicesPage from './pages/services';
import OverweightPage from './pages/overweight';
import ConditionsPage from './pages/conditions';
import LoginPage from './pages/login';

const AppRoutes = () => {
    return (
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/aviso-de-privacidad" component={PrivacyPage} />
            <Route exact path="/admin" component={AdminPage} />
            <Route exact path="/contacto" component={ContactPage} />
            <Route exact path="/cotizacion" component={QuotePage} />
            <Route exact path="/direcciones" component={DirectionPage} />
            <Route exact path="/enviar" component={SendPage} />
            <Route exact path="/historial" component={RecordPage} />
            <Route exact path="/mi-cuenta" component={AccountPage} />
            <Route exact path="/servicios" component={ServicesPage} />
            <Route exact path="/sobrepeso" component={OverweightPage} />
            <Route exact path="/terminos-y-condiciones" component={ConditionsPage} />
            <Route exact path="/login" component={LoginPage} />
            <Redirect to="/" />
        </Switch>
    );
};

const AppRoutes = () => {}
  return (<Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/admin" component={AdminPage} />
            <Route>
              <Layout>
                <Switch>
                  <Route path="/aviso-de-privacidad" component={PrivacyPage} />
                  <Route component={HomePage} />
                </Switch>
              </Layout>
            </Route>
          </Switch>);

export default AppRoutes;

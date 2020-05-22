import React from 'react';
import { Route, Switch } from 'react-router-dom';

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
import Layout from './components/layout';
import { StyledMain } from './components/layout/styled';
import { AccountSidebar, AdminSidebar } from './components/layout/sidebar';

const AppRoutes = () => {
    return (
        <Switch>
            <Route path="/admin">
                <StyledMain>
                    <Switch>
                        <Route exact path="/admin" component={AdminPage} />
                    </Switch>
                </StyledMain>
            </Route>
            <Route path="/mi-cuenta">
                <StyledMain>
                    <AccountSidebar />
                    <Switch>
                        <Route path="/historial" component={RecordPage} />
                        <Route path="/sobrepeso" component={OverweightPage} />
                        <Route path="/direcciones" component={DirectionPage} />
                        <Route path="/contacto" component={ContactPage} />
                        <Route component={AccountPage} />
                    </Switch>
                </StyledMain>
            </Route>
            <Route>
                <Layout>
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/aviso-de-privacidad" component={PrivacyPage} />
                        <Route exact path="/cotizacion" component={QuotePage} />
                        <Route exact path="/direcciones" component={DirectionPage} />
                        <Route exact path="/enviar" component={SendPage} />
                        <Route exact path="/historial" component={RecordPage} />
                        <Route exact path="/mi-cuenta" component={AccountPage} />
                        <Route exact path="/servicios" component={ServicesPage} />
                        <Route exact path="/sobrepeso" component={OverweightPage} />
                        <Route exact path="/terminos-y-condiciones" component={ConditionsPage} />
                    </Switch>
                </Layout>
            </Route>
        </Switch>
    );
};

export default AppRoutes;

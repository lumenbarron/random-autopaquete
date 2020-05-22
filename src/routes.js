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
                        <AdminSidebar />
                        {/* Otras rutas de admin aquí
                  <Route path="/usuarios" component={UsersPage} />
                  <Route path="/usuario/:uid" component={UserPage} />
                  <Route path="/sobrepesos" component={AddOverweightsPage} />
                  */}
                        <Route component={AdminPage} />
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
                        <Route path="/login" component={LoginPage} />
                        <Route path="/aviso-de-privacidad" component={PrivacyPage} />
                        <Route path="/servicios" component={ServicesPage} />
                        <Route path="/cotizacion" component={QuotePage} />
                        <Route path="/enviar" component={SendPage} />
                        <Route path="/terminos-y-condiciones" component={ConditionsPage} />
                        <Route component={HomePage} />
                    </Switch>
                </Layout>
            </Route>
        </Switch>
    );
};

export default AppRoutes;

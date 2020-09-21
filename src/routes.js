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
import DocumentsPage from './pages/documents';
import AdminOverweightPage from './pages/adminoverweight';
import AdminUserEditPage from './pages/adminuseredit';
import AdminUsersPage from './pages/adminusers';
import ConditionsPage from './pages/conditions';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import Layout from './components/layout';
import { StyledMain } from './components/layout/styled';
import { AccountSidebar, AdminSidebar } from './components/layout/sidebar';

const AppRoutes = () => {
    return (
        <Switch>
            <Route exact path="/admin" component={AdminPage} />
            <Route path="/admin">
                <StyledMain style={{ display: 'flex' }}>
                    <AdminSidebar />
                    <Switch>
                        <Route path="/admin/documentacion" component={DocumentsPage} />
                        <Route path="/admin/sobrepesos" component={AdminOverweightPage} />
                        <Route path="/admin/usuario/:userId" component={AdminUserEditPage} />
                        <Route path="/admin/usuarios" component={AdminUsersPage} />
                        <Redirect to="/admin" />
                    </Switch>
                </StyledMain>
            </Route>
            <Route path="/mi-cuenta">
                <StyledMain style={{ display: 'flex' }}>
                    <AccountSidebar />
                    <Switch>
                        <Route path="/mi-cuenta/historial" component={RecordPage} />
                        <Route path="/mi-cuenta/sobrepeso" component={OverweightPage} />
                        <Route path="/mi-cuenta/direcciones" component={DirectionPage} />
                        <Route path="/mi-cuenta/contacto" component={ContactPage} />
                        <Route path="/mi-cuenta/enviar/:idGuia/:step" component={SendPage} />
                        <Route path="/mi-cuenta/enviar" component={SendPage} />
                        <Route path="/mi-cuenta/" component={AccountPage} />
                        <Redirect to="/login" />
                    </Switch>
                </StyledMain>
            </Route>
            <Route>
                <Layout>
                    <Switch>
                        <Route path="/documentacion" component={DocumentsPage} />
                        <Route exact path="/" component={HomePage} />
                        <Route exact path="/login" component={LoginPage} />
                        <Route path="/signup" component={SignUpPage} />
                        <Route exact path="/aviso-de-privacidad" component={PrivacyPage} />
                        <Route exact path="/cotizacion" component={QuotePage} />
                        <Route exact path="/servicios" component={ServicesPage} />
                        <Route exact path="/terminos-y-condiciones" component={ConditionsPage} />
                    </Switch>
                </Layout>
            </Route>
        </Switch>
    );
};

export default AppRoutes;

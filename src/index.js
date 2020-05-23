import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { FirebaseAppProvider } from 'reactfire';
import App from './app';
import firebase from './components/firebase/firebase';

ReactDOM.render(
    <FirebaseAppProvider firebaseConfig={firebase}>
        <Suspense fallback="Conectando con  la app...">
            <App />
        </Suspense>
    </FirebaseAppProvider>,
    document.getElementById('root'),
);

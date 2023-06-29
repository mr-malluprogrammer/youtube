import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './css/index.css';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from 'react-auth-kit'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthProvider
        authType={"cookie"}
        authName={"_auth"}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
    >

        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthProvider>
);

const title = ReactDOM.createRoot(document.getElementById('title'));
title.render(
    "Mr.MalluProgrammer"
);

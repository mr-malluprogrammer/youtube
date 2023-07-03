import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './css/index.css';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

        <BrowserRouter>
            <App />
        </BrowserRouter>
);

const title = ReactDOM.createRoot(document.getElementById('title'));
title.render(
    "Mr.MalluProgrammer"
);
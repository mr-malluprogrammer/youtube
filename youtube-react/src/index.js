import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
    <App />
    </div>
);

const title = ReactDOM.createRoot(document.getElementById('title'));
title.render(
   "Mr.MalluProgrammer"
);

import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
    // If pre-rendered HTML exists, hydrate it (attach event listeners)
    hydrate(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        rootElement
    );
} else {
    // Otherwise, render normally
    render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        rootElement
    );
}
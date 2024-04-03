import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './general.css';
import App from './App';

import { AuthContextProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
        <ShopProvider>
            <App />
        </ShopProvider>
    </AuthContextProvider> 
);

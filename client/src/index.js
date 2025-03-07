import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UserStore from './store/UserStore';
import ProductStore from './store/ProductStore';

export const Context = createContext({
    user: new UserStore(),
    product: new ProductStore(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Context.Provider value={Context._currentValue}>
            <App />
        </Context.Provider>
    </React.StrictMode>
);

reportWebVitals();

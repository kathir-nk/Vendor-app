import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './utils/store';

// ✅ ADD THIS LINE HERE
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

window.addEventListener("load", function() {
    setTimeout(() => {
        const licenseMessage = document.querySelector('div[style*="Syncfusion Essential Studio"]');
        if (licenseMessage) {
            licenseMessage.remove();
        }

        const syncfusionSpan = document.querySelector("span");
        if (syncfusionSpan) {
            syncfusionSpan.remove();
        }

        const syncfusionLink = document.querySelector('a[href*="claim-license-key"]');
        if (syncfusionLink) {
            syncfusionLink.remove();
        }
    }, 100);
});

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

reportWebVitals();
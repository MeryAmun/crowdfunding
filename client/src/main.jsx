import React from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { ThirdwebProvider,ChainId } from "@thirdweb-dev/react";
import App from './App';
import './index.css'
import { StateContextProvider } from './context';
import { Sepolia } from "@thirdweb-dev/chains";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
       <ThirdwebProvider activeChain={ Sepolia }>
       <BrowserRouter>
       <StateContextProvider>
        <App/>
       </StateContextProvider>
       </BrowserRouter>
       </ThirdwebProvider>
    </React.StrictMode>
)
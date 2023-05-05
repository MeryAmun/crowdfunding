import React from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { ThirdwebProvider,ChainId } from "@thirdweb-dev/react";
import App from './App';
import './index.css'

const activeChain = "ethereum";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
       <ThirdwebProvider ChainId={[activeChain,ChainId.Goerli]}>
       <BrowserRouter>
       <App/>
       </BrowserRouter>
       </ThirdwebProvider>
    </React.StrictMode>
)
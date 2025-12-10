/*
Written by: Jacqueline Rael
Date: 12/08/2025
Lab: Final Lab
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.scss'

// Render the React app inside the root element with routing enabled
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/~raelj982/GottaCollectEmAll-React/frontend/">
      <App />
    </BrowserRouter>
  </StrictMode>,
)

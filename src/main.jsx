  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App.jsx'
  import './index.css'
  import { BrowserRouter } from "react-router-dom";
import CandidatesContext from './Context/CandidatesContext.jsx';
import AuthContext from './Context/AuthContext.jsx';

  ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <AuthContext>

<CandidatesContext>
<App />

</CandidatesContext>
</AuthContext>

    
    </BrowserRouter> 
  )

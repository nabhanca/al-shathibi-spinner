import { useContext, useEffect, useState } from 'react'

import './App.css'
import Spinner from './components/spinner/Spinner'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import Display from './pages/Display';
import Toss from './pages/Toss';
import NotFound from './pages/NotFound';
import Navbar from './components/navbar/Navbar';
import CandidatesContext, { CandidateContextProvider } from './Context/CandidatesContext';
import Loader from './components/loder/Loader';
import Signup from './components/Login/Login';
import Admin from './pages/Admin';
import Question from './pages/Question';


function App() {

  

  return (
  <>
   
    <>
    

    <Navbar/>

    <Routes>
       <Route path='/' element={<HomePage/>}/>
       <Route path='img/:id' element={<Display/>}/>
       <Route path='toss/:id' element={<Toss/>}/>
       <Route path='signup' element={<Signup/>}/>
       <Route path='admin' element={<Admin/>}/>
       <Route path='question/:code' element={<Question/>}/>
       <Route path='*' element={<NotFound/>}/>
    </Routes>
    

    

    </>
 

  </>

  )
}

export default App

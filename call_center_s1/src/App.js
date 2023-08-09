import './App.css';
import InputInformation from './feattures/InpuInformation';
import ResponsiveAppBar from './components/header';
import { Route, Routes, BrowserRouter} from 'react-router-dom'
import React from 'react';

import callAPI from './api/callAPI';
import { useEffect } from 'react';


function App() {
  // useEffect(()=>{
  //   const fetchCalls = async () =>{
  //     const calls= await  callAPI.getAll()
  //     console.log(calls);
  //   }
  //   fetchCalls()
  // })
  

  
  return (
    <BrowserRouter>
        <ResponsiveAppBar></ResponsiveAppBar>
        
          <Routes>
            
            <Route path="/" Component={InputInformation}/>
            
          </Routes>
        
          
        
    </BrowserRouter>
  );
}

export default App;

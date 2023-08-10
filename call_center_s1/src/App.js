import './App.css';
import InputInformation from './feattures/InpuInformation';
import ResponsiveAppBar from './components/header';
import { Route, Routes, BrowserRouter} from 'react-router-dom'
import React from 'react';
import S2 from './feattures/s2'

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
            <Route path="/s2" Component={S2}/>
            
          </Routes>
          
        
          
        
    </BrowserRouter>
  );
}

export default App;

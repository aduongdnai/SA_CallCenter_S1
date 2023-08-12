import './App.css';
import CallCenterS1 from './feattures/CallCenterS1';
import ResponsiveAppBar from './components/header';
import { Route, Routes, BrowserRouter} from 'react-router-dom'
import React from 'react';

import callAPI from './api/callAPI';
import { useEffect } from 'react';
import CallCenterS2 from './feattures/CallCenterS2';


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
            
            <Route path="/" Component={CallCenterS1}/>
            <Route path="/S2" Component={CallCenterS2}/>
            
            
          </Routes>
          
        
          
        
    </BrowserRouter>
  );
}

export default App;

import './App.css';
import CallCenterS1 from './feattures/CallCenterS1';
import ResponsiveAppBar from './components/header';
import { Route, Routes, BrowserRouter} from 'react-router-dom'
import React from 'react';

import callAPI from './api/callAPI';
import { useEffect } from 'react';
import CallCenterS2 from './feattures/CallCenterS2';
import NewAddressItem from './feattures/CallCenterS2/components/newAddressItem';
import { Box, Stack } from '@mui/material';
import SideBar from './components/SideBar';
import CallCenterS3 from './feattures/CallCenterS3';


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
        <Stack spacing={3} direction="row">
          <Box sx={{py: 3, px: 1}} className="leftPannel" > 
            <SideBar/>
          </Box>
          <Box className="rightPannel">
            <Routes>
              <Route path="/" Component={CallCenterS1}/>
              <Route path="/S2" Component={CallCenterS2}/>
              <Route path='/S2/NewAddressItem' Component={NewAddressItem}></Route>
              <Route path='/S3' Component={CallCenterS3}></Route>
            </Routes>
          </Box>
        </Stack>
        
    </BrowserRouter>
  );
}

export default App;

import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

import ReactMapGL from '@goongmaps/goong-map-react';
import Map from '../../components/Map';
import mapAPI from '../../api/mapApi';
import mapboxgl from '@goongmaps/goong-js';
import * as mqtt from 'mqtt'
import { MAP_API_KEY } from '../../api/mapAxiosClient';
import callAPI from '../../api/callAPI';
import NewAddressList from './components/newAddressList';
import { Box, Card, CardContent, CardHeader, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
CallCenterS2.propTypes = {
    
};

function CallCenterS2(props) {
      const navigate=useNavigate()
      //mqtt connect attribute and function
      const [newAddressList,setNewAddressList]=useState()
      const fetchNewAddresslist= async ()=>{
        const result=await callAPI.findInCompleteCall()
        console.log(result.data);
        setNewAddressList(result.data)
        return result
      }
      useEffect(()=>{
        
        fetchNewAddresslist()
      },[])
          const [client, setClient] = useState(null);

          useEffect(() => {
            const mqttOptions = {
            clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
            // ws -> 8083; wss -> 8084
            
            /**
             * By default, EMQX allows clients to connect without authentication.
             * https://docs.emqx.com/en/enterprise/v4.4/advanced/auth.html#anonymous-login
             */
            username: 'emqx_test',
            password: 'emqx_test',
            clean: true,
            reconnectPeriod: 1000, // ms
            connectTimeout: 30 * 1000, // ms
              // MQTT connection options
            };
            console.log(mqtt);
            const mqttClient = mqtt.connect('ws://broker.emqx.io:8083/mqtt', mqttOptions);
        
            mqttClient.on('connect', () => {
              console.log('Component A connected to MQTT');
              mqttClient.subscribe('callcenter/checkingAddress', { qos: 0 });
            });
        
            mqttClient.on('message', (topic, message) => {
              console.log(`Received message in S1 from topic ${topic}: ${message.toString()}`);
              const mess=JSON.parse(message)
              fetchNewAddresslist()

            });
        
            setClient(mqttClient);
        
            return () => {
              mqttClient.end();
            };
          }, []);
      
      const handleAddressClick=(call)=>{
        const dataToSend={
          key:{call}
        }
        navigate('/s2/NewAddressItem',{ state: dataToSend })
        console.log(123);
      }
      
      return (
          <Box sx={{ flexGrow: 1, margin: 2 }}>
          <Grid container spacing={2}>
            {/* <Grid item xs={3}>
              <Card>
                <CardContent>
                 <Map></Map>
                </CardContent>
                
              </Card>
            </Grid> */}
            <Grid item xs={12}>
                
                <Card sx={{height:500}}>
                <CardHeader title='New Address List'>
                  
                </CardHeader>
                <CardContent>
                <NewAddressList newAddressList={newAddressList} onAddressClick={handleAddressClick}></NewAddressList>
                </CardContent>
                
                </Card>
                
              
            </Grid>
            
          </Grid>
        </Box>
       
            
        
      
      );
}

export default CallCenterS2;
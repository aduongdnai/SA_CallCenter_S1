import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

import ReactMapGL from '@goongmaps/goong-map-react';
import Map from '../../components/Map';
import mapAPI from '../../api/mapApi';
import mapboxgl from '@goongmaps/goong-js';
import * as mqtt from 'mqtt';
import { MAP_API_KEY } from '../../api/mapAxiosClient';
import callAPI from '../../api/callAPI';
import NewAddressList from './components/DriverList';
import { Box, Button, Card, CardContent, CardHeader, Dialog, Divider, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DriverList from './components/DriverList';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
CallCenterS3.propTypes = {};

const MQTT_JOIN_POOL_TOPIC = 'KTPM/MQTT_JOIN_POOL_TOPIC';
const MQTT_LEAVE_POOL_TOPIC = 'KTPM/MQTT_LEAVE_POOL_TOPIC';
const MQTT_LISTEN_BOOKING_TOPIC = 'KTPM/MQTT_LISTEN_BOOKING_TOPIC';
const MQTT_UPDATE_LOCATION_TOPIC = 'KTPM/MQTT_UPDATE_LOCATION_TOPIC';
const MQTT_SENDING_BOOKING_TOPIC = 'KTPM/MQTT_SENDING_BOOKING_TOPIC';
const MQTT_SENDING_BOOKING_DRIVER_TOPIC =
  'KTPM/MQTT_SENDING_BOOKING_DRIVER_TOPIC';
const MQTT_REFUSE_BOOKING_DRIVER_TOPIC =
  'KTPM/MQTT_REFUSE_BOOKING_DRIVER_TOPIC';
const MQTT_ACCEPT_BOOKING_DRIVER_TOPIC =
  'KTPM/MQTT_ACCEPT_BOOKING_DRIVER_TOPIC';
const MQTT_ACCEPT_BOOKING_USER_TOPIC =
  'KTPM/MQTT_ACCEPT_BOOKING_USER_TOPIC';
const MQTT_COMPLETE_BOOKING_TOPIC =
  'KTPM/MQTT_COMPLETE_BOOKING_TOPIC';
const MQTT_COMPLETE_BOOKING_USER_TOPIC =
  'KTPM/MQTT_COMPLETE_BOOKING_USER_TOPIC';

function CallCenterS3(props) {
  const [client, setClient] = useState(null);
  const [drivers, setDrivers] = useState([])
  const [driverViewed, setDriverViewed] = useState(null)
  const fetchDriversList= async ()=>{
    const result = await callAPI.getAllDrivers()
    setDrivers(result.data)
  }
  useEffect(()=>{
    fetchDriversList()
  },[])

  const onDriverClick = (driver) => {
    setDriverViewed(driver)
  }
  const handleClose = () => setDriverViewed(null)

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
    const mqttClient = mqtt.connect(
      'ws://broker.emqx.io:8083/mqtt',
      mqttOptions
    );

    mqttClient.on('connect', () => {
      console.log('Component A connected to MQTT');
      mqttClient.subscribe(MQTT_JOIN_POOL_TOPIC, { qos: 0 });
      mqttClient.subscribe(MQTT_LEAVE_POOL_TOPIC, { qos: 0 });
    
    });

    mqttClient.on('message', async (topic, message) => {
      switch(topic){
        case MQTT_JOIN_POOL_TOPIC: {
          const driverId = message.toString()
          
          const newList = []
          for(let driver of drivers){
            if(driver.id == driverId)
              driver.status = "Active"
            newList.push(driver)
          }
          console.log(newList)
          setDrivers(newList)

          break
        }
        case MQTT_LEAVE_POOL_TOPIC: {
          const driverId = message.toString()
          
          const newList = []
          for(let driver of drivers){
            if(driver.id == driverId)
              driver.status = "Inactive"
            newList.push(driver)
          }
          console.log(newList)
          setDrivers(newList)

          break
        }
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  return (
    <Box sx={{ flexGrow: 1, margin: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Driver List"></CardHeader>
            <CardContent>
              <DriverList driverList={drivers} onDriverClick={onDriverClick}></DriverList>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {!!driverViewed && (
        <Dialog
          open={!!driverViewed}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Driver Information"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <Typography color="black">ID: {driverViewed?.id}</Typography>
              <Typography color="black">Name: {driverViewed?.nickName}</Typography>
              <Typography color="black">Address: {driverViewed?.address}</Typography>
              <Typography color="black">Rating: {driverViewed?.rating}</Typography>
              <Divider sx={{my: 1}}/>
              <DialogTitle sx={{p: 0}} color="black" id="alert-dialog-title">
                {"Trip Information:"}
              </DialogTitle>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default CallCenterS3;

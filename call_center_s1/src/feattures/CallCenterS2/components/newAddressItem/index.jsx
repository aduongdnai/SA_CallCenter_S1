import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InputTextField from '../../../../components/form-controls/InputTextField';
import { useForm } from 'react-hook-form';
import * as yup from "yup"
import { Card,Box,Grid,CardContent, Button, CardHeader, TextField } from '@mui/material';
import Map from '../../../../components/Map';
import { useLocation,useNavigate } from 'react-router-dom';
import mapAPI from '../../../../api/mapApi';
import ReactMapGL,{FlyToInterpolator,Marker} from '@goongmaps/goong-map-react';
import { MAP_API_KEY } from '../../../../api/mapAxiosClient';
import Pin from '../../../../components/Pin/pin'
import * as d3 from 'd3-ease';
import callAPI from '../../../../api/callAPI';
import * as mqtt from 'mqtt'
NewAddressItem.propTypes = {
    
};

function NewAddressItem(props) {
    const navigate = useNavigate();
    const schema = yup
    .object().shape({
        old_address:  yup.string().min(4, "At least 4 character"),
        new_address:  yup.string().required('New address is required').min(4, "At least 4 character"),
        
        
    
    })
    const location=useLocation()
    const curCall=location.state.key.call
    const map_api_key=MAP_API_KEY()
    useEffect(()=>{
        setValueTextField(curCall.pickup_address)
    },[])
   

    
    const form=useForm({
        defaultValues:{
            old_address:'',
            new_address:'',
        }
    })
    const [client,setClient]=useState()
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
      const mqttClient = mqtt.connect('ws://broker.emqx.io:8083/mqtt', mqttOptions);
  
      mqttClient.on('connect', () => {
        console.log('Component A connected to MQTT');
        
      });
  
      mqttClient.on('message', (topic, message) => {
        console.log(`Received message in S2 from topic ${topic}: ${message.toString()}`);
        const mess=JSON.parse(message)
        

      });
  
      setClient(mqttClient);
  
      return () => {
        mqttClient.end();
      };
    }, []);
    const {register,formState,handleSubmit}=form
    const onSubmit=async ()=>{
        const data={
          lat:marker.latitude,
          lng:marker.longitude,
          pickup_address:valueTextField
        }
        const a=await callAPI.updateCall(curCall._id,data)
        const context={
          topic:'callcenter/publishCall',
          qos:0,
          payload:JSON.stringify({
            _id:curCall._id
          })
        }
        mqttPublish(context)
    }
    const Back=()=>{
        navigate(-1)
    }
    const mqttPublish = (context) => {
        
      if (client) {
        const { topic, qos, payload } = context;
        client.publish(topic, payload, { qos }, error => {
          if (error) {
            console.log('Publish error: ', error);
          }
        });
      }
    }
    const [valueTextField,setValueTextField]=useState()
    const [newAddressPosition,setNewAddressPosition]=useState({
        lat:  10.80158,
        lng: 106.66690})
    const [viewport, setViewport] = useState({
        latitude:   10.80158,
        longitude: 106.66690,
        zoom: 14,
        bearing: 0,
        pitch: 0
    });
    const [marker, setMarker] = useState({
        latitude:  viewport.latitude,
        longitude: viewport.longitude,
      });
    const handleChangeTextField=(event)=>{
        setValueTextField(event.target.value)
    }
    const CheckNewAddress=async ()=>{
        const result=await mapAPI.adressToGeoCode(valueTextField)
        console.log(result.results);
        setValueTextField(result.results[0].formatted_address)
        setNewAddressPosition(result.results[0].geometry.location)
        setViewport({
            ...viewport,
            longitude: result.results[0].geometry.location.lng,
            latitude: result.results[0].geometry.location.lat,
            zoom: 14,
            transitionDuration: 5000,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic
          });
          setMarker({
            longitude: result.results[0].geometry.location.lng,
            latitude: result.results[0].geometry.location.lat
          })
    }
    return (
        <Box sx={{ flexGrow: 1, margin: 2}}>
          <Grid container spacing={2}>
          <Grid item xs={6}>
              <Card>
                <CardContent>
                <ReactMapGL
              {...viewport}
              width="710px"
              height="450px"
              onViewportChange={setViewport}
              goongApiAccessToken={map_api_key}
              
              >
                <Marker
                latitude={marker.latitude}
                longitude={marker.longitude}
                offsetTop={-20}
                offsetLeft={-10}
                  
                >
                  <Pin size={20} />
                </Marker>
              </ReactMapGL>
                </CardContent>
                
              </Card>
            </Grid>
            <Grid item xs={6}>
            <Card sx={{margin:2}}>
                <CardHeader title='Chỉnh sửa địa chỉ'>
                    
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} >
                    <TextField sx={{marginTop:2}} {...register("old_address")}  label="Địa chỉ cũ" inputProps={
					{ readOnly: true, }
				}  value={curCall.pickup_address} fullWidth></TextField><br/>
                    <TextField sx={{marginTop:2}} {...register("new_address")}
                      label="Địa chỉ mới" value={valueTextField} fullWidth
                      onChange={handleChangeTextField}></TextField><br/>
                    <Button style={{marginTop:'10px'}} type='submit' variant='outlined'>Submit</Button>
                    <Button style={{marginTop:'10px', marginLeft:'10px'}} type='button' variant='outlined' color='error'
                    onClick={Back}
                    >Back</Button>
                    <Button style={{marginTop:'10px', marginLeft:'10px'}} type='button' variant='outlined' color='success'
                    onClick={CheckNewAddress}
                    >Check</Button>
                </form>  
                </CardContent>
               
                
            </Card>
            </Grid>
                
          </Grid>
          </Box>
        
    );
}

export default NewAddressItem;
import React, { useEffect, useState,useCallback } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from "yup"
import { Card,Box,Grid,CardContent, Button, CardHeader, TextField } from '@mui/material';
import { useLocation,useNavigate } from 'react-router-dom';
//import mapAPI from '../../../../api/mapApi';
import ReactMapGL,{FlyToInterpolator,Marker} from '@goongmaps/goong-map-react';
import { MAP_API_KEY } from '../../../../api/mapAxiosClient';
import Pin from '../../../../components/Pin/pin'
import * as d3 from 'd3-ease';
import callAPI from '../../../../api/callAPI';
import userAPI from '../../../../api/userApi';
import * as mqtt from 'mqtt'
import { availablePlugins } from '../../../../plugins/pluginConfig';
import CallAdapter from '../../../../utils/CallAdapter';
import controlPanel from '../../../../components/control-panel';
import './style.css'


NewAddressItem.propTypes = {
    
};

function NewAddressItem(props) {
    async function loadMapPlugin(selectedPluginName) {
      const selectedPlugin = availablePlugins.find(plugin => plugin.name === selectedPluginName);

      if (selectedPlugin) {
          const {default: plugin} = await import(`../../../../plugins/${selectedPlugin.directory}/mapApi`);
          
          // Now you can use the mapAPI functions
          console.log(plugin);
          return plugin
      } else {
          console.log(`Plugin "${selectedPluginName}" not found.`);
      }
  }
    // Switch between plugins based on user input or logic
    
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
        setDropOffAddress(curCall.dropoff_address)
    },[])
   

    
    const form=useForm({
        defaultValues:{
            old_address:'',
            new_address:'',
        }
    })
    const [client,setClient]=useState()
    useEffect( ()  =>  {
     
      const mqttOptions = {
      clientId: 'emqx_react_' + Math.random().toString(16).substring(2, 8),
      // ws -> 8083; wss -> 8084
      
      /**
       * By default, EMQX allows clients to connect without authentication.
       * https://docs.emqx.com/en/enterprise/v4.4/advanced/auth.html#anonymous-login
       */
      username: '',
      password: '',
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
        // MQTT connection options
      };
      const mqttClient = mqtt.connect('ws://broker.emqx.io:8083/mqtt', mqttOptions);
  
      mqttClient.on('connect', () => {
        console.log('S2 connected to MQTT');
        
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
          ...curCall,
          lat:marker.latitude,
          lng:marker.longitude,
          pickup_address:valueTextField,
          dropoff_address:dropOffAddress,
          isComplete:true
        }
        console.log("data",data);
        const a=await callAPI.updateCall(curCall._id,data)
        const updateUserInformation= await userAPI.update({
          id:"guest75963396",
          nickName: curCall.phone_number,
          phoneNumber: curCall.phone_number,
          email: curCall.phone_number,
          address:data.pickup_address,
          latitude:data.lat,
          longitude:data.lng
         })
         console.log(updateUserInformation);
         const callAdapter=new CallAdapter(data)
        const booking=callAdapter.convertToBooking()
        console.log("Boooking",booking);
        const context={
          topic:'KTPM/MQTT_SENDING_BOOKING_TOPIC',
          qos:0,
          payload:JSON.stringify(booking)
        }
        
        mqttPublish(context)
        alert("Đặt xe thành công")
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
    const [dropOffAddress,setDropOffAddress]=useState()
    const [mapAPI, setMapAPI] = useState(null);
    const defaultPluginName = "Goong Map"; // Change this to the name of your default plugin
    
    const [selectedPluginName, setSelectedPlugin] = useState(defaultPluginName);
    
    const [viewport, setViewport] = useState({
        latitude:   10.80158,
        longitude: 106.66690,
        zoom: 10,
        bearing: 0,
        pitch: 0
    });
    const [marker, setMarker] = useState({
        latitude:  viewport.latitude,
        longitude: viewport.longitude,
      });
    const [markerDropOff, setMarkerDropOff] = useState({
      latitude:  viewport.latitude,
      longitude: viewport.longitude,
    });
    const handleChangeTextField=(event)=>{
        setValueTextField(event.target.value)
    }
    const handleChangeDropOffAddress=(event)=>{
        setDropOffAddress(event.target.value)
    }
    const handlePluginChange = async (event) => {
      const selectedPluginName = event.target.value;
      setSelectedPlugin(selectedPluginName);
  
      // Updating the mapAPI state with the loaded functionality
  };
  
    const CheckNewAddress=async ()=>{
          
         // Change this based on user input or logic
        const mapAPI = await loadMapPlugin(selectedPluginName);
        setMapAPI(mapAPI);
        if (mapAPI) {
          const result = await mapAPI.addressToGeocode(valueTextField)
          if(result.results && result.results.length > 0){
            setValueTextField(result.results[0].formatted_address)
            setMarker({
              longitude: result.results[0].geometry.location.lng,
              latitude: result.results[0].geometry.location.lat
            })
            setViewport({
                ...viewport,
                longitude: result.results[0].geometry.location.lng,
                latitude: result.results[0].geometry.location.lat,
                zoom: 11,
                transitionDuration: 5000,
                transitionInterpolator: new FlyToInterpolator(),
                transitionEasing: d3.easeCubic
              });
              
            }
           else {
            console.log("No results found.");
          }
        }
        else{
          console.log("Plugin not found or failed to load.");
        }
    
    };
    const CheckNewDropOffAddress=async ()=>{
          
      // Change this based on user input or logic
     const mapAPI = await loadMapPlugin(selectedPluginName);
     setMapAPI(mapAPI);
     if (mapAPI) {
       const result = await mapAPI.addressToGeocode(dropOffAddress)
       if(result.results && result.results.length > 0){
         setDropOffAddress(result.results[0].formatted_address)
         setMarkerDropOff({
          longitude: result.results[0].geometry.location.lng,
          latitude: result.results[0].geometry.location.lat
        })
         setViewport({
          ...viewport,
          longitude: result.results[0].geometry.location.lng,
          latitude: result.results[0].geometry.location.lat,
          zoom: 11,
          transitionDuration: 5000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: d3.easeCubic
        });
         
           
         }
        else {
         console.log("No results found.");
       }
     }
     else{
       console.log("Plugin not found or failed to load.");
     }
    
 };
 const [events,logEvents]=useState()
  const onMarkerStartDragEnd=useCallback(event => {
    logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
    fetchAddressFromGeocode( event.lngLat[0],event.lngLat[1],"pickup")
    setMarker({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    });
  }, []);
  
  const onMarkerEndDragEnd= useCallback(event => {
    logEvents(_events => ({..._events, onDragEnd: event.lngLat}));
    fetchAddressFromGeocode( event.lngLat[0],event.lngLat[1],"dropoff")
    setMarkerDropOff({
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    });
  }, []);
  const fetchAddressFromGeocode=async (lng, lat, addresstype)=>{
      const mapAPI = await loadMapPlugin(selectedPluginName);
      setMapAPI(mapAPI);
    if (mapAPI && mapAPI.geoCodeToAddress) {
      
      // Access the property or call the method
      const result= await mapAPI.geoCodeToAddress(lat,lng)

      console.log("réult",result);
      switch(addresstype){
        case "pickup":
          setValueTextField(result.results[0].formatted_address)
          break;
        case "dropoff":
          setDropOffAddress(result.results[0].formatted_address)
          break;
        default:
          break;
      }
    } else {
      console.log("Failed");
    }
  }
    return (
        <Box sx={{ flexGrow: 1, margin: 2}}>
          <Grid container spacing={2}>
          <Grid item xs={4}>
              <Card>
                <CardContent>
                <ReactMapGL
                {...viewport}
                width="460px"
                height="450px"
                onViewportChange={setViewport}
                goongApiAccessToken={map_api_key}
               
              >
                <Marker
                latitude={marker.latitude}
                longitude={marker.longitude}
                offsetTop={-20}
                offsetLeft={-10}
                draggable
                onDragEnd={onMarkerStartDragEnd}
                >
                  <Pin size={20} />
                </Marker>
                <Marker
                latitude={markerDropOff.latitude}
                longitude={markerDropOff.longitude}
                offsetTop={-20}
                offsetLeft={-10}
                draggable
                onDragEnd={onMarkerEndDragEnd}
                >
                  <Pin  size={20} />
                </Marker>
              </ReactMapGL>
              <controlPanel events={events}></controlPanel>
                </CardContent>
                
              </Card>
          </Grid>
          <Grid item xs={8}>
          <Card >
              <CardHeader title='Chỉnh sửa địa chỉ'>
                  
              </CardHeader>
              <CardContent>
                <div style={{display:'flex', alignItems:"center"}}>
                  <h4>MAP API</h4>
                  <select style={{marginLeft:5, height:'20px'}} value={selectedPluginName} onChange={handlePluginChange}>
                            {availablePlugins.map((plugin) => (
                                <option key={plugin.name} value={plugin.name}>
                                    {plugin.name}
                                </option>
                            ))}
                  </select>
                </div>
              
              <form onSubmit={handleSubmit(onSubmit)} >
                  <TextField sx={{marginTop:2, width:'850px'}} {...register("old_address")}  size="small" label="Địa chỉ cũ" 
                  inputProps={
                  { readOnly: true, }
                  }  
                  value={curCall.pickup_address} ></TextField><br/>
                  <TextField sx={{marginTop:2, width:'850px'}} {...register("new_address")} id="new_address" size="small"
                    label="Địa chỉ đón" value={valueTextField} 
                    onChange={handleChangeTextField}></TextField>
                  <Button sx={{marginTop:'20px', marginLeft:'10px'}} type='button' target='new_address' variant='outlined' color='success'
                  onClick={CheckNewAddress}
                  >Check</Button><br/>
                  <TextField sx={{marginTop:2, width:'850px' }} {...register("new_dropoff_address")}  size="small"
                  label="Địa chỉ đến" value={dropOffAddress} 
                  onChange={handleChangeDropOffAddress}></TextField> 
                    <Button style={{marginTop:'20px', marginLeft:'10px'}} type='button' variant='outlined' color='success'
                  onClick={CheckNewDropOffAddress}
                  >Check</Button><br/>
                  <Button style={{marginTop:'10px'}} type='submit' variant='outlined'>Submit</Button>
                  <Button style={{marginTop:'10px', marginLeft:'10px'}} type='button' variant='outlined' color='error'
                  onClick={Back}
                  >Back</Button>
                  
              </form>  
             
              </CardContent>
              
              
          </Card>
          </Grid>
                
          </Grid>
          </Box>
        
    );
}

export default NewAddressItem;
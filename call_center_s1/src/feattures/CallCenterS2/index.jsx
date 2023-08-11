import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

import ReactMapGL from '@goongmaps/goong-map-react';
import Map from '../../components/Map';
import mapAPI from '../../api/mapApi';
import * as mqtt from 'mqtt'
CallCenterS2.propTypes = {
    
};

function CallCenterS2(props) {
      //mqtt connect attribute and function
     
      const initialConnectionOptions = {
            // ws or wss
            
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
          }
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
              console.log(`Received message in Component A from topic ${topic}: ${message.toString()}`);
            });
        
            setClient(mqttClient);
        
            return () => {
              mqttClient.end();
            };
          }, []);
      useEffect(()=>{
          
            // const convert= async ()=>{
            //       const result= await mapAPI.adressToGeoCode('694 Trường Chinh, Tân Hưng Thuận, District 12, Ho Chi Minh City')
            //       console.log(result);
            // }
            // convert()
      },[])

      
      return (
        <div>
                  {/* <Map></Map> */}
        </div>
            
            
        
      
      );
}

export default CallCenterS2;
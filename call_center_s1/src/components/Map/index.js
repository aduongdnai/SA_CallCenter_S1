import React, { useEffect, useRef,useState } from 'react';
import {useForm} from 'react-hook-form'
import mqtt from 'mqtt'
import ReactMapGL from '@goongmaps/goong-map-react';

const Map = ( props ) => {
    
      
      const [viewport, setViewport] = useState({
        latitude: 18.7616,
        longitude: 105.6474,
        zoom: 7,
        bearing: 0,
        pitch: 0
      });
      
      return (
        
              <ReactMapGL
              {...viewport}
              width="100vw"
              height="100vh"
              mapStyle="https://tiles.goong.io/assets/goong_map_dark.json"
              onViewportChange={setViewport}
              goongApiAccessToken="gOaJEchgjoBByaWaik61iQ4uZsRZYC5BqrzOlzNn"
              />
            
        
      
      );
     
   }
 export default Map;


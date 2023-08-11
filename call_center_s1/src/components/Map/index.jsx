import React, { useState } from 'react';

import ReactMapGL from '@goongmaps/goong-map-react';
import { MAP_API_KEY } from '../../api/mapAxiosClient';
const Map = ( props ) => {
      const map_api_key=MAP_API_KEY()
      
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
              goongApiAccessToken={map_api_key}
              />
            
        
      
      );
     
   }
 export default Map;


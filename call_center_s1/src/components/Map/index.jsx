import React, { useState } from 'react';

import ReactMapGL, { Marker } from '@goongmaps/goong-map-react';
import { MAP_API_KEY } from '../../api/mapAxiosClient';
import Pin from '../Pin/pin'
import PropTypes from 'prop-types';
Map.propTypes = {
  viewport: PropTypes.object.isRequired,
  setViewport:PropTypes.func.isRequired
};
function Map  ( props )  {
      const map_api_key=MAP_API_KEY()
      const {viewport,setViewport}=props
      
      
      const [marker, setMarker] = useState({
        latitude:  viewport.latitude,
        longitude: viewport.longitude,
      });
      const handleSetViewPort=(values)=>{
        console.log('Todo Form: ', viewport);
        const {setViewport}=props
        if(setViewport){
          setViewport(values)
        }
        
    }
      return (
        
              <ReactMapGL
              {...viewport}
              width="710px"
              height="450px"
              onViewportChange={handleSetViewPort}
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
            
        
      
      );
     
   }
 export default Map;


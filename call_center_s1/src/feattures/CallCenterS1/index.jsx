import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select'
import PhoneNumberField from '../../components/form-controls/PhoneNumberField';
import InputTextField from '../../components/form-controls/InputTextField';
import { Button,Box, Grid, Card,CardHeader,CardContent, Table, TableRow, TableCell} from '@mui/material';
import {useForm, Controller} from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import callAPI from '../../api/callAPI';
import * as mqtt from 'mqtt'




CallCenterS1.propTypes = {
   
};

function CallCenterS1(props) {
    const vehicle_options = [
        { value: '1', label: 'Xe hơi' },
        { value: '2', label: 'Xe máy' },
        { value:'',   label:'None'}
        
      ]
    const schema = yup
    .object().shape({
        phone_number: yup.string().required('Phone number is required')
        .matches(/^(?:\+?84|0)(?:1\d{9}|3\d{8}|5\d{8}|7\d{8}|8\d{8}|9\d{8})$/, 'Invalid phone number'),
        name:  yup.string().required('Customer name is required').min(4, "At least 4 character"),
        pickup_address:  yup.string().required('Address is required').min(4, "At least 4 character"),
        car_type: yup.object({
            value: yup.string().required("Please select a vehicle"),
         }),
        
    
    })
    const form=useForm({
        defaultValues:{
            phone_number:"",
            name:"",
            pickup_address:"",
            car_type:"",

        },
        resolver:yupResolver(schema)
    })
    const { register, handleSubmit, watch, formState: { errors,touchedFields } ,control,reset} = form;
   
    //connect mqtt broker
    const [client, setClient] = useState(null)
    
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
      };
  
      const mqttClient = mqtt.connect('ws://broker.emqx.io:8083/mqtt', mqttOptions);
  
      mqttClient.on('connect', () => {
        console.log('S1 connected to MQTT');
        mqttClient.subscribe('callcenter/exactAddress', { qos: 0 });
      });
  
      mqttClient.on('message', (topic, message) => {
        console.log(`Received message in S2 from topic ${topic}: ${message.toString()}`);
      });
  
      setClient(mqttClient);
  
      return () => {
        mqttClient.end();
      };
    }, []);
     
      
     
      
      
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
    
      const onSubmit = async (data) =>{ 
        
        const car_type=data.car_type
        data.car_type=car_type.value      
        const curDate=new Date()
        data.time=curDate.toISOString()
        data.isComplete=false
        data.lat=0
        data.lng=0
        console.log(data);
        
        
        const result=await callAPI.isAddressExist(data.phone_number,data.pickup_address)
        
        console.log(result);
        if(!result.data){
          console.log('not exist');
          
          
            const publishContent={
              topic:'callcenter/checkingAddress',
              qos:0,
              payload: JSON.stringify({
                phone_number:data.phone_number,
                pickup_address:data.pickup_address
              })
            }
          setTimeout(mqttPublish, 500,publishContent);
        }
        else{
           //gan lai is Complete de khong vao 
           console.log('exist');
           data.isComplete=true
           const result=await callAPI.findGeocode(data.phone_number,data.pickup_address)
           console.log("cc",result);
           const lat=parseFloat(result.data.lat)
           const lng=parseFloat(result.data.lng)
           console.log(typeof(lat));
           data.lat=lat
           data.lng=lng
           console.log(data);
           const context={
            topic:'callcenter/publishCall',
            payload:JSON.stringify(data),
            qos:0
           }
           mqttPublish(context)
        }
        callAPI.add(data)
          
        reset( {
          phone_number:"",
          name:"",
          pickup_address:"",
          car_type:"",

      })
    }
    let SelectHasError=errors['car_type'] && touchedFields['car_type']
    return (
      <Box>
          <Grid container spacing={2}>
          <Grid item xs={12} >
          <Card sx={{height:500}}>
              <Table>
                <TableRow>
                  <TableCell align='center'>
                  
                  <CardHeader title='Book car'>
                    
                  </CardHeader>
                  <CardContent align='center'>

                    <form style={{marginTop: '10px', width:'400px'}} onSubmit={handleSubmit(onSubmit)} 
                    defaultValue={ {
                        phone_number:"",
                        name:"",
                        pickup_address:"",
                        car_type:"",

                    }}> 
                        <PhoneNumberField  {...register("phone_number")}  label="Số Điện Thoại" form={form}></PhoneNumberField>
                        <InputTextField {...register("name")}  label="Tên Khách Hàng" form={form}></InputTextField>
                        <InputTextField {...register("pickup_address")}  label="Địa chỉ đón" form={form}></InputTextField>
                        
                        <Controller
                            {...register("car_type")}
                            control={control}
                            render={({ field }) => <Select
                            errors={SelectHasError}
                            helpertext={errors['car_type']?.message}
                            
                            {...field} 
                            options={vehicle_options}
                            styles={{
                                control: (baseStyles, state) => ({
                                  ...baseStyles,
                                  marginTop:'10px'
                                }),
                              }} 
                            />}
                        />
                        <Button type='submit' variant="outlined" style={{marginTop:'10px'}}>Submit</Button>
                    </form>
                    </CardContent>
                  </TableCell>
                </TableRow>
              </Table>             
            </Card>
          </Grid>
        </Grid>
      </Box>
       
        
        
    );
}

export default CallCenterS1;